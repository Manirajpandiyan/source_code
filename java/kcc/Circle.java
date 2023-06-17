package com.kcc.dataaccess.model.region;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Circle {

	public Integer circleId;
	public String circleNameInEn;
	public String circleNameInTa;
	public Integer stateId;
	public Integer zoneId;
	public Integer districtId;
	public String status;
	public Integer createdBy;
	public Date createdDate;
	public Integer lastUpdatedBy;
	public Integer lastUpdatedDate;

}

