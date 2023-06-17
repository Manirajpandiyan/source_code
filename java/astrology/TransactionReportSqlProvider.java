package com.astromatch.dataaccess.model.sqlprovider;

import java.io.Serializable;

import org.apache.ibatis.annotations.Param;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.astromatch.common.AppContextVO;
import com.astromatch.common.Constants;
import com.astromatch.service.impl.TransactionReportServiceImpl;

public class TransactionReportSqlProvider implements Serializable{

	static final Logger logger = LoggerFactory.getLogger(TransactionReportSqlProvider.class);

	private static final long serialVersionUID = 1L;
	
	public String transactionReportFilterSqlStatement(@Param("payerName")String payerName, @Param("transactionStartDate")String transactionStartDate,
			@Param("transactionEndDate")String transactionEndDate, @Param("status")String status) {
		logger.info("Entry point of transactionReportFilterSqlStatement, payerName-->"+payerName+"<--transactionStartDate-->" +transactionStartDate+
				"<--transactionEndDate-->"+transactionEndDate+"<--status-->"+status+"<--");
		String sql = "SELECT apd.*, asbd.tax_number, dd.document_id, dd.document_path, dd.document_name,up.first_name,up.last_name "
				+ "FROM astrologer_payment_details apd "
				+ "LEFT JOIN astrologer_bank_details asbd ON asbd.astrologer_id = apd.astrologer_id AND asbd.astrologer_bank_id = apd.astrologer_bank_id "
				+ "LEFT JOIN document_details dd ON dd.document_id = apd.document_id "
				+ "LEFT JOIN user_profile up ON up.user_id=apd.astrologer_id "
				+ "WHERE apd.status='"+status.toUpperCase()+"'";
		
		if(payerName!=null && !payerName.trim().equalsIgnoreCase("") && payerName.contains(" ") ) {
			String[] astrologerNameArray = payerName.split(" ");
			sql+=" AND (up.first_name = '"+astrologerNameArray[0]+"' AND up.last_name = '"+astrologerNameArray[1]+"')";
		}else {
			if(payerName!=null && !payerName.trim().equalsIgnoreCase("")) sql+=" AND (up.first_name like '%"+payerName+"%' OR up.last_name like '%"+payerName+"%')";
		}
		
		if(transactionEndDate==null && (transactionStartDate!=null && !transactionStartDate.trim().equals(""))) sql+=" AND apd.bank_transaction_date=#{transactionStartDate}";
		if(transactionStartDate==null && (transactionEndDate!=null && !transactionEndDate.trim().equals(""))) sql+=" AND apd.bank_transaction_date=#{transactionEndDate}";
		if((transactionStartDate !=null && !transactionStartDate.trim().equals("")) && (transactionEndDate!=null && !transactionEndDate.trim().equals(""))) sql+=" AND apd.bank_transaction_date BETWEEN #{transactionStartDate} AND #{transactionEndDate}";
		
		sql+=" ORDER BY apd.bank_transaction_date DESC ";
		logger.info("Exit point of transactionReportFilterSqlStatement->sql->"+sql);
		return sql;
	}
	
	public String astrologerTransactionReportFilterSqlStatement(@Param("userId")Integer userId, @Param("transactionDate")String transactionDate, @Param("status")String status) {
		logger.info("Entry point of astrologerTransactionReportFilterSqlStatement, userId -->"+userId+"<--transactionDate-->" +transactionDate+"<--status-->"+status+"<--");
		String sql = "SELECT apd.*, asbd.tax_number, dd.document_id, dd.document_path, dd.document_name "
				+ "FROM astrologer_payment_details apd "
				+ "LEFT JOIN astrologer_bank_details asbd ON asbd.astrologer_id = apd.astrologer_id AND asbd.astrologer_bank_id = apd.astrologer_bank_id "
				+ "LEFT JOIN document_details dd ON dd.document_id = apd.document_id "
				+ "WHERE apd.status='"+status.toUpperCase()+"' AND apd.astrologer_id = #{userId}";
		
		if(transactionDate!=null && !transactionDate.trim().equals("")) sql+=" AND apd.bank_transaction_date=#{transactionDate}";
		
		sql+=" ORDER BY apd.bank_transaction_date DESC ";
		
		logger.info("Exit point of astrologerTransactionReportFilterSqlStatement->sql"+sql);
		return sql;
	}
	
	public String transactionDetailsFilterSqlStatement(@Param("service")String service, @Param("transactionFromDate")String transactionFromDate,
			@Param("transactionToDate")String transactionToDate) {
		
		logger.info("Entry point of TransactionReportSqlProvider->transactionDetailsFilterSqlStatement, service-->"+service+"<--transactionFromDate-->" +transactionFromDate+
				"<--transactionToDate-->"+transactionToDate+"<--");
		
		String sql=" SELECT td.transaction_id,td.transaction_type,td.reference_service_id,td.amount,td.transaction_date, "
				+ " paid.paid_transaction_id,paid.astrologer_payment_id,paid.astrologer_name, "
				+ " concat(up.first_name,' ',up.last_name) as user_name,(((CEILING(TIME_TO_SEC(cd.chat_duration) / 60) * cd.chat_cost_per_min) * cd.platform_commission)/100) as commission , "
				+ " paid.payment_transaction_date,paid.paid_amount "
				+ " FROM transaction_details td "
				+ " LEFT JOIN "
				+ "	   (SELECT td.transaction_id, td.transaction_id AS paid_transaction_id,apid.astrologer_payment_id, "
				+ "    concat(up.first_name,' ',up.last_name) AS astrologer_name,apd.bank_transaction_date AS payment_transaction_date,apd.amount as paid_amount "
				+ "    FROM astrologer_payment_details apd "
				+ "    LEFT JOIN astrologer_payment_item_details apid ON apid.astrologer_payment_id=apd.astrologer_payment_id "
				+ "    LEFT JOIN transaction_details td ON td.transaction_id=apid.transaction_id "
				+ "    LEFT JOIN chat_details cd ON cd.chat_id=td.reference_service_id "
				+ "    LEFT JOIN user_profile up ON up.user_id=cd.astrologer_id "
				+ "    WHERE apd.status='PAID' AND td.transaction_type='"+Constants.CHAT+"' ";
				
				if((null!=transactionFromDate && !transactionFromDate.trim().equals(""))  
				&& (null!=transactionToDate && !transactionToDate.trim().equals(""))
				&& service.trim().equalsIgnoreCase(Constants.PAYMENT_TO_ASTROLOGER))sql+=" AND apd.bank_transaction_date BETWEEN '"+transactionFromDate+" ' AND '"+transactionToDate+"' ";
				
				sql	+= " ) paid ON td.transaction_id=paid.transaction_id "
				+ " LEFT JOIN chat_details cd ON cd.chat_id=td.reference_service_id AND td.transaction_type='"+Constants.CHAT+"' "
				+ " LEFT JOIN user_profile up ON up.user_id=td.user_id "
				+ " WHERE  td.transaction_status='"+Constants.SUCCESS+"' ";
		
		if(null!=service && !service.trim().equals("")
				&& service.trim().equalsIgnoreCase(Constants.PAYMENT_TO_ASTROLOGER)) sql+=" AND td.transaction_type='"+Constants.CHAT+"' ";
		else if(null!=service && !service.trim().equals("")
				&& !service.trim().equalsIgnoreCase(Constants.PAYMENT_TO_ASTROLOGER))sql+=" AND td.transaction_type='"+service+"' ";
		
		if((null!=transactionFromDate && !transactionFromDate.trim().equals(""))  
				&& (null!=transactionToDate && !transactionToDate.trim().equals("")) 
						&&(null!=service && !service.trim().equals(""))
						&& !service.trim().equalsIgnoreCase(Constants.PAYMENT_TO_ASTROLOGER))sql+=" AND td.transaction_date BETWEEN '"+transactionFromDate+Constants.SPACE+Constants.DAY_START_TIME+"' AND '"+transactionToDate+Constants.SPACE+Constants.DAY_END_TIME+"' ";
				
				sql+= " ORDER BY td.transaction_date DESC ";
				
	    logger.info("Exit point of TransactionReportSqlProvider->transactionDetailsFilterSqlStatement,sql-->"+sql);
		return sql;
	}
}
