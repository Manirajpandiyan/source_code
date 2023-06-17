package com.astromatch.service.impl;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.astromatch.common.AppContextVO;
import com.astromatch.common.Constants;
import com.astromatch.dataaccess.admin.TransactionReportDataMapper;
import com.astromatch.dataaccess.model.admin.TransactionDetailsVO;
import com.astromatch.dataaccess.model.platform.AstrologerPaymentDetails;
import com.astromatch.dataaccess.platform.PlatformAdminDataMapper;
import com.astromatch.dataaccess.valueobjects.admin.TransactionReportVO;
import com.astromatch.service.TransactionReportService;
import com.astromatch.utils.ConfigMap;

@Service
public class TransactionReportServiceImpl implements TransactionReportService {

	static final Logger logger = LoggerFactory.getLogger(TransactionReportServiceImpl.class);

	@Autowired
	private TransactionReportDataMapper transactionReportDataMapper;
	
	@Autowired
	private PlatformAdminDataMapper platformAdminDataMapper;

	@Override
	public List<TransactionReportVO> getAllAstrologerTransactionReport(AppContextVO appContextVO,String payerName, String transactionDate, String transactionStartDate,
			String transactionEndDate, String status, Integer page, Integer pageSize) {

		logger.info("Entry point of getAllAstrologerTransaction Report"+"<--page-->"+page+"<--pageSize-->"+pageSize+"<-- transactionDate -->"+transactionDate+"<--payerName-->"+payerName
				+"<--transactionStartDate-->"+transactionStartDate+"<--transactionEndDate-->"+transactionEndDate+"<--status-->"+status);
		List<TransactionReportVO> transactionReportList = null;
		List<TransactionReportVO> transactionReportVOList = null;
		Double totalEarnings=0.0;
		Double totalPaidAmount=0.0;
		try {
			if(appContextVO.getRoleId()== 1) {
				transactionReportVOList = transactionReportDataMapper.getAllAstrologerTransactionReport(payerName, transactionStartDate, transactionEndDate, status);
			}
			if(appContextVO.getRoleId()== 2) {
				transactionReportVOList = transactionReportDataMapper.getAstrologerTransactionReport(appContextVO.getUserId(), transactionDate, status);
			}
			int offset = (page - 1) * pageSize;
			float f = (float) transactionReportVOList.size();
			float s = (float) pageSize;
			float totalPagespre = (transactionReportVOList.size() / pageSize);

			float totalPages = (f == s) || (f < s) ? 1 : (f % s) == 0 ? totalPagespre : totalPagespre + 1;
			Integer totalOfPages = (int) totalPages;
			if (transactionReportVOList.size() > 0 && offset <= transactionReportVOList.size()) {
				transactionReportList = transactionReportVOList.subList(offset,
						Math.min(offset + pageSize, transactionReportVOList.size()));
				for (TransactionReportVO transactionReportDetails : transactionReportList) {
					transactionReportDetails.setTotalPages(totalOfPages);
					transactionReportDetails.setTotalRecords(transactionReportVOList.size());
					if((System.currentTimeMillis() - transactionReportDetails.getCreatedDate().getTime())>(Integer.parseInt(ConfigMap.getInstance().getPlatformSettingsMap().get(".payment.revert.cutoff.time.in.minutes"))*60*1000)) {
						transactionReportDetails.setRevertOption(0);		
					}else transactionReportDetails.setRevertOption(1);
					
				}
			}
			

		} catch (Exception ex) {
			logger.error("Error while getAllAstrologerTransaction Report", ex);
		}
		logger.info("Exit point of getAllAstrologerTransaction Report");
		return transactionReportList;
	}

	@Override
	public Integer transactionRevert(Integer paymentId, String remarks,String createdDate) {
		logger.info("Entry point of transactionRevert, paymentId --->"+paymentId+"<--- remarks --->"+remarks+"--createdDate-->"+createdDate);
		Integer count = 0;
		String reverCutoffTime="";
		try {

			Date paymentCreatedDate =null;
			paymentCreatedDate= new SimpleDateFormat("EEE MMM dd HH:mm:ss zzz yyyy").parse(createdDate);
			if((System.currentTimeMillis() - paymentCreatedDate.getTime())>(Integer.parseInt(ConfigMap.getInstance().getPlatformSettingsMap().get(".payment.revert.cutoff.time.in.minutes"))*60*1000)) {
				count=-1;
				logger.info("Exit point #1 of transactionRevert");
				return count;
			}
			
			count = transactionReportDataMapper.updateTransactionRevert(paymentId, remarks);
		}
		catch(Exception ex) {
			logger.error("Error while transaction revert service", ex);
		}
		logger.info("Exit point #2 of transactionRevert");
		return count;
	}

	@Override
	public List<TransactionReportVO> getAllAstrologerTransactions(AppContextVO appContextVO,
			Integer astrologerPaymentId) {
		logger.info("Entry point of get all astrologer transactions, appContextVO --->"+appContextVO+"<--- astrologerPaymentId --->"+astrologerPaymentId);
		List<TransactionReportVO> transactiontVOList = null;
		
		try {
			transactiontVOList = transactionReportDataMapper.getAstrologerTrasactions(astrologerPaymentId);
		}
		catch(Exception ex) {
			logger.error("Error while get all astrologer transactions", ex);
		}
		logger.info("Exit point of get all astrologer transactions");
		return transactiontVOList;
	}
	

	@Override
	public List<TransactionDetailsVO> getAllTransactionDetails(AppContextVO appContextVO, Integer pageSize,	Integer pageNo,
			String service,String transactionFromDate,String transactionToDate) {
		logger.info("Entry point of TransactionReportServiceImpl->getAllTransactionDetails, appContextVO --->"+appContextVO.getUserId()+"<--- pageSize --->"+pageSize+"<--pageNo-->"+pageNo);
		
		List<TransactionDetailsVO> transactionDetailsVOList=null;
		List<TransactionDetailsVO> transactionVOList=null;
    	TransactionDetailsVO sortTransactionDetailsVO = null;

		try {
			
			transactionDetailsVOList=transactionReportDataMapper.getAllTransactionDetails(service,transactionFromDate,transactionToDate);
			
			if(null!=service && !service.trim().equals("")
					&& service.trim().equalsIgnoreCase(Constants.PAYMENT_TO_ASTROLOGER)) {
				for(int i=0;i<transactionDetailsVOList.size();i++) {
					if(null==transactionDetailsVOList.get(i).getPaidTransactionId()) {
						transactionDetailsVOList.remove(i);
						i--;
					}
				}
				
			}else if(null!=service && !service.trim().equals("")
					&& service.trim().equalsIgnoreCase(Constants.CHAT)){
				for(int j=0;j<transactionDetailsVOList.size();j++) {
					if(null!=transactionDetailsVOList.get(j).getPaidTransactionId()) {
						transactionDetailsVOList.remove(j);
						j--;
					}
				}
			}
			
	        if((null==service || service.trim().equals("")) &&(null!=transactionFromDate && !transactionFromDate.trim().equals(""))  
					&& (null!=transactionToDate && !transactionToDate.trim().equals(""))) {
	        	SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
	        	Date fromDate = dateFormat.parse(transactionFromDate);
	        	Date toDate = dateFormat.parse(transactionToDate);
	        	toDate.setHours(23);
	        	toDate.setMinutes(59);
	        	toDate.setSeconds(59);
	        	
	        	for(int k=0;k<transactionDetailsVOList.size();k++) {
	        		
	        		if(null!=transactionDetailsVOList.get(k).getPaidTransactionId()) {
	        			if(transactionDetailsVOList.get(k).getPaymentTransactionDate().before(fromDate)) {
	        				transactionDetailsVOList.remove(k);
							k--;
	        			}else if(transactionDetailsVOList.get(k).getPaymentTransactionDate().after(toDate)) {
	        				transactionDetailsVOList.remove(k);
							k--;
	        			}
	        		}else {
	        			if(transactionDetailsVOList.get(k).getTransactionDate().before(fromDate)) {
	        				transactionDetailsVOList.remove(k);
							k--;
	        			}else if(transactionDetailsVOList.get(k).getTransactionDate().after(toDate)) {
	        				transactionDetailsVOList.remove(k);
							k--;
	        			}
	        		}
	        	}
	        }
	        
	        for(int k=0;k<transactionDetailsVOList.size();k++) {
	        	if(null!=transactionDetailsVOList.get(k).getPaidTransactionId()) {
	        		sortTransactionDetailsVO = transactionDetailsVOList.get(k);
	        		sortTransactionDetailsVO.setTransactionDate(sortTransactionDetailsVO.getPaymentTransactionDate());
        			transactionDetailsVOList.set(k, sortTransactionDetailsVO);
        		}
	        }
	        Collections.sort(transactionDetailsVOList);
	        
			int offset = (pageNo - 1) * pageSize;

				float f = (float) transactionDetailsVOList.size();

				float s = (float) pageSize;

				float totalPages_pre = (transactionDetailsVOList.size()/ pageSize);

				float totalPages = (f == s) || (f < s) ? 1 : (f % s) == 0 ? totalPages_pre : totalPages_pre + 1;
				Integer totalOfPages=(int)totalPages;
				if(transactionDetailsVOList.size()>0 && offset<=transactionDetailsVOList.size()) {
					transactionVOList = transactionDetailsVOList.subList(offset, Math.min(offset +pageSize, transactionDetailsVOList.size()));
					for(TransactionDetailsVO transactionDetailsVO : transactionVOList) {	
						transactionDetailsVO.setTotalPages(totalOfPages);
						transactionDetailsVO.setTotalSize(transactionDetailsVOList.size());
					}
				}
		}catch(Exception ex) {
			
			logger.error("Error while TransactionReportServiceImpl->getAllTransactionDetails", ex);
		}

		logger.info("Exit point of TransactionReportServiceImpl->getAllTransactionDetails"+transactionVOList);
		return transactionVOList;
	}

}
