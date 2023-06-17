package com.astromatch.dataaccess.model.admin;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TransactionDetailsVO implements Comparable<TransactionDetailsVO> {
	
	private Integer transactionId;
	private Integer userId;
	private Date transactionDate;
	private String transactionType;
	private Double amount;
	private Double balance;
	private Integer referenceServiceId;
	private String transactionStatus;
	private String remarks;
	private Integer documentId;
	private String firstName;
	private String lastName;
	private Double platformCommission;
	private Double commission;
	private Integer totalPages;
	private Integer totalSize;
	private String transactionFromDate;
	private String transactionToDate;
	private String service;
	private Integer pageSize;
	private Integer pageNo;
	private Integer paidTransactionId;
	private Integer astrologerPaymentId;
	private String astrologerName;
	private String userName;
	private Date paymentTransactionDate;
	private Double paidAmount;
	private Integer createdBy;
	private Date createdDate;
	private Integer lastUpdatedBy;
	private Date lastUpdatedDate;
	
	@Override
	public int compareTo(TransactionDetailsVO tdVO) {
		return tdVO.getTransactionDate().compareTo(this.getTransactionDate());
	}
	
}
