package com.astromatch.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.astromatch.common.AppContextVO;
import com.astromatch.dataaccess.model.admin.TransactionDetailsVO;
import com.astromatch.dataaccess.model.users.UserProfile;
import com.astromatch.dataaccess.valueobjects.admin.TransactionReportVO;

@Service
public interface TransactionReportService {
	
	public List<TransactionReportVO> getAllAstrologerTransactionReport(AppContextVO appContextVO,String payerName, String transationDate, String transactionStartDate,
			String transactionEndDate, String status, Integer page, Integer pageSize);
	
	public Integer transactionRevert(Integer paymentId, String remarks, String createdDate);
	
	public List<TransactionReportVO> getAllAstrologerTransactions(AppContextVO appContextVO,Integer astrologerPaymentId);

	public List<TransactionDetailsVO> getAllTransactionDetails(AppContextVO appContextVO, Integer pageSize,
			Integer pageNo, String service, String transactionFromDate, String transactionToDate);

}
