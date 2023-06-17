	public static HashMap<String, String> validateCircle(Circle circle, Locale locale) {
		ResourceBundle bundle = ResourceBundle.getBundle("i18n/messages", locale);		
		HashMap<String,String> errorMap = new HashMap<String,String>();
		
		if(null == circle) {
			errorMap.put(Constants.CIRCLE_NAME_IN_TA, bundle.getString("invalid.data"));
			errorMap.put(Constants.CIRCLE_NAME_IN_EN, bundle.getString("invalid.data"));
			errorMap.put(Constants.STATE_ID, bundle.getString("invalid.data"));
			errorMap.put(Constants.ZONE_ID, bundle.getString("invalid.data"));
			errorMap.put(Constants.DISTRICT_ID, bundle.getString("invalid.data"));
		}else {
			if(null == circle.getCircleNameInEn() || circle.getCircleNameInEn().trim().equals("")) {
				errorMap.put(Constants.CIRCLE_NAME_IN_EN, bundle.getString("required.data"));
			}else if(circle.getCircleNameInEn().trim().length()> Integer.parseInt(ConfigMap.getInstance().getConfigCategoryMap().get(Constants.VALIDATION_RULE).get("name.max.length")) ) {
				errorMap.put(Constants.CIRCLE_NAME_IN_EN, bundle.getString("max.length.exceeded"));
			}
			
			if(null == circle.getCircleNameInTa() || circle.getCircleNameInTa().trim().equals("")) {
				errorMap.put(Constants.CIRCLE_NAME_IN_TA, bundle.getString("required.data"));
			}else if(circle.getCircleNameInTa().trim().length()> Integer.parseInt(ConfigMap.getInstance().getConfigCategoryMap().get(Constants.VALIDATION_RULE).get("name.max.length")) ) {
				errorMap.put(Constants.CIRCLE_NAME_IN_TA, bundle.getString("max.length.exceeded"));
			}
					
			if(null == circle.getStateId() || circle.getStateId()==0) {
				errorMap.put(Constants.STATE_ID, bundle.getString("required.data"));
			}else if(circle.getStateId()<0) {
				errorMap.put(Constants.STATE_ID, bundle.getString("invalid.data"));
			}
			
			if(null == circle.getZoneId() || circle.getZoneId()==0) {
				errorMap.put(Constants.ZONE_ID, bundle.getString("required.data"));
			}else if(circle.getZoneId()<0) {
				errorMap.put(Constants.ZONE_ID, bundle.getString("invalid.data"));
			}
			
			if(null == circle.getDistrictId() || circle.getDistrictId()==0) {
				errorMap.put(Constants.DISTRICT_ID, bundle.getString("required.data"));
			}else if(circle.getDistrictId()<0) {
				errorMap.put(Constants.DISTRICT_ID, bundle.getString("invalid.data"));
			}
		}
		logger.info("errorMap-->"+errorMap.toString()+"<--");
		return errorMap;
	}
	