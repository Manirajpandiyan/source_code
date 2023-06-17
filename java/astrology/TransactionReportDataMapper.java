package com.astromatch.dataaccess.admin;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.SelectProvider;
import org.apache.ibatis.annotations.Update;

import com.astromatch.common.Constants;
import com.astromatch.dataaccess.model.admin.TransactionDetailsVO;
import com.astromatch.dataaccess.model.platform.AstrologerPaymentDetails;
import com.astromatch.dataaccess.model.sqlprovider.TransactionReportSqlProvider;
import com.astromatch.dataaccess.valueobjects.admin.TransactionReportVO;

@Mapper
public interface TransactionReportDataMapper {
	
	//Astrologer paid transaction details platform admin side
	@SelectProvider(type = TransactionReportSqlProvider.class, method = "transactionReportFilterSqlStatement")
	List<TransactionReportVO> getAllAstrologerTransactionReport(@Param("payerName")String payerName, @Param("transactionStartDate")String transactionStartDate,
			@Param("transactionEndDate")String transactionEndDate, @Param("status")String status);
	
	//Astrologer paid transaction details astrologer side
	@SelectProvider(type = TransactionReportSqlProvider.class, method = "astrologerTransactionReportFilterSqlStatement")
	List<TransactionReportVO> getAstrologerTransactionReport(@Param("userId") Integer userId, @Param("transactionDate") String transactionDate, @Param("status")String status);
	
	//Total earnings of astrologer
	@Select("SELECT SUM(IF(TIME_TO_SEC(chat_duration)>59 ,(CEILING(TIME_TO_SEC(chat_duration) / 60) * chat_cost_per_min),(1 * chat_cost_per_min))) AS total_earning FROM chat_details "
			+ "WHERE astrologer_id = #{userId} AND status IN ('"+Constants.ENDED_BY_USER+"','"+Constants.ENDED_BY_ASTROLOGER+"','"+Constants.TIME_OUT+"','"+Constants.INSUFFICIENT_BALANCE_STATUS+"','"+Constants.NETWORK_ISSUE_ON_ASTROLOGER_SIDE+"','"+Constants.NETWORK_ISSUE_ON_USER_SIDE+"') "
			+ "GROUP BY astrologer_id")
	Double getTotalEarnings(@Param("userId")Integer userId);
	
	//Astrologer total paid amount
	@Select("SELECT SUM(IF(amount IS NULL,0, amount) + IF(tax_amount IS NULL, 0, tax_amount) + IF(other_charges IS NULL, 0, other_charges) ) AS total_paid_amount "
			+ "FROM astrologer_payment_details "
			+ "WHERE astrologer_id = #{userId} AND status = '"+Constants.PAID+"' "
			+ "GROUP BY astrologer_id")
	Double getTotalPaidAmount(@Param("userId")Integer userId);
	
	//Astrologer Payment revert
	@Update("UPDATE astrologer_payment_details SET status='"+Constants.REVERTED+"', remarks=#{remarks} WHERE astrologer_payment_id =#{paymentId}")
	Integer updateTransactionRevert(Integer paymentId, String remarks);

	@SelectProvider(type = TransactionReportSqlProvider.class, method = "transactionDetailsFilterSqlStatement")
	List<TransactionDetailsVO> getAllTransactionDetails(String service, String transactionFromDate,String transactionToDate);
	
//	Astologer full payment details 
	@Select("SELECT cd.chat_id,up.first_name,up.last_name,td.transaction_date,apd.astrologer_payment_id,CEILING(TIME_TO_SEC(cd.chat_duration)/60) AS chat_duration, cd.chat_cost_per_min*(CEILING(TIME_TO_SEC(cd.chat_duration)/60)) AS earnings  "
			+ "FROM astrologer_payment_item_details apid "
			+ "LEFT JOIN astrologer_payment_details apd ON apd.astrologer_payment_id = apid.astrologer_payment_id "
			+ "LEFT JOIN user_profile up ON apd.astrologer_id = up.user_id "
			+ "LEFT JOIN transaction_details td ON td.transaction_id = apid.transaction_id "
			+ "LEFT JOIN chat_details cd ON td.reference_service_id = cd.chat_id AND  td.transaction_type='CHAT' "
			+ "WHERE apd.astrologer_payment_id = #{astrologerPaymentId}")
	List<TransactionReportVO> getAstrologerTrasactions(@Param("astrologerPaymentId")Integer astrologerPaymentId);

}
