	@RequestMapping(value={"/admin/region/circle"},method= RequestMethod.GET)
	public String circleList(HttpServletRequest request, HttpServletResponse response, Model model, Locale locale) {
		
		logger.info("Entry point of circleList GET locale -->"+locale+"<-- model -->"+model+"<--");
		
		HttpSession session = request.getSession(false);
		
		if(null == session) {
			logger.error("Invalid session. session object is null");
			logger.info("Exit point #1 circleList GET ");
			return "login";
		}
		AppContextVO appContextVO = (AppContextVO) session.getAttribute(Constants.APP_CONTEXT);
		
		if(null == appContextVO) {
			logger.error("Invalid session. appContextVO is null");
			logger.info("Exit point #2 circleList GET ");
			return "login";
		}
		
		ArrayList<Integer> activeUserIdList = ConfigMap.getInstance().getActiveUsersUserIdList();
		
		if(!activeUserIdList.contains(appContextVO.getUserId())) {			
			logger.error("Invalid user. User is inactive");
			logger.info("Exit point #2.1 circleList GET");
			return "login";			
		}
		
		if(appContextVO.getRoleId() != Constants.SUPER_ADMIN) {
			SecurityLogger.getInstance().securityLog("Don't have authority to access -- circleList --"
					+ "Invalid login credentials --> userId ="+appContextVO.getUserId()+", emailAddress ="+appContextVO.getEmailAddress()+"<--");
			logger.info("Exit point #3 of circleList GET ");
			session.invalidate();
			return "login";
		}

		try {			
			List<CircleVO> circleList = regionService.getAllActiveCircles();
			model.addAttribute(Constants.CIRCLE_LIST, circleList);
			
			List<State> stateList = regionService.getAllActiveStates();
			model.addAttribute(Constants.STATE_LIST, stateList);
			
			List<ZoneVO> zoneList = regionService.getAllActiveZones();
			model.addAttribute(Constants.ZONE_LIST, zoneList);
			
			List<DistrictVO> districtList = regionService.getAllActiveDistricts();
			model.addAttribute(Constants.DISTRICT_LIST, districtList);
			
		}catch(Exception ex) {
			logger.error("Error while get the circle list",ex);
			ResourceBundle bundle = ResourceBundle.getBundle("i18n/messages", locale);
			model.addAttribute(Constants.ERROR, bundle.getString("unknown.error"));
			logger.info("Exit point #4 of circleList GET ");
			return "/errorPage";
		}
		
		model.addAttribute(Constants.APP_CONTEXT, appContextVO);	
		logger.info("Exit point #5 of circleList GET");		
		return "admin/circleList";
	}
	
	@RequestMapping(value={"/admin/region/addCircle"}, method = RequestMethod.POST)
	public String addCircle(HttpServletRequest request,
			HttpServletResponse response,Circle circle, Model model, Locale locale) {		
		
		logger.info("Entry point of addCircle POST model -->"+model+"<-- locale -->"+locale+"<-- circle -->"+circle);
		
		HttpSession session = request.getSession(false);
		
		if(null == session) {
			logger.error("Invalid session. session object is null");
			logger.info("Exit point #1 addCircle POST ");
			return "login";
		}
		AppContextVO appContextVO = (AppContextVO) session.getAttribute(Constants.APP_CONTEXT);
		
		if(null == appContextVO) {
			logger.error("Invalid session. appContextVO is null");
			logger.info("Exit point #2 addCircle POST ");
			return "login";
		}
		
		ArrayList<Integer> activeUserIdList = ConfigMap.getInstance().getActiveUsersUserIdList();
		
		if(!activeUserIdList.contains(appContextVO.getUserId())) {			
			logger.error("Invalid user. User is inactive");
			logger.info("Exit point #2.1 addCircle POST");
			return "login";			
		}
		
		if(appContextVO.getRoleId() != Constants.SUPER_ADMIN) {
			SecurityLogger.getInstance().securityLog("Don't have authority to access -- addCircle --"
					+ "Invalid login credentials --> userId ="+appContextVO.getUserId()+", emailAddress ="+appContextVO.getEmailAddress()+"<--");
			logger.info("Exit point #3 of addCircle POST ");
			session.invalidate();
			return "login";
		}
		
		List<ZoneVO> zoneList = null;
		List<State> stateList = null;
		List<DistrictVO> districtList = null;
		List<CircleVO> circleList = null;
		HashMap<String,String> errorMap = RegionValidator.validateCircle(circle, locale);
		
		if(null != errorMap && errorMap.size()>0) {
			
			logger.info("errorMap--->"+errorMap);
			 model.addAttribute(Constants.ERROR_MAP, errorMap);

			 zoneList = regionService.getAllActiveZones();
			 model.addAttribute(Constants.ZONE_LIST, zoneList);
			 
			 stateList = regionService.getAllActiveStates();
			 model.addAttribute(Constants.STATE_LIST, stateList);
			 
			 districtList = regionService.getAllActiveDistricts();
			 model.addAttribute(Constants.DISTRICT_LIST, districtList);
			 
			 circleList = regionService.getAllActiveCircles();
			 model.addAttribute(Constants.CIRCLE_LIST, circleList);

			 model.addAttribute(Constants.CIRCLE, circle);
			 
			 model.addAttribute(Constants.APP_CONTEXT, appContextVO);
			 
			 logger.info("Exit point #4 addCircle POST ");
			 return "admin/circleList";
		}
		
		try {
			regionService.addCircle(appContextVO, circle);
		}catch(DuplicateRecordException dre) {
			logger.error("Error while adding circle -->"+dre.getStatusMessage()+"<--");
			ResourceBundle bundle = ResourceBundle.getBundle("i18n/messages", locale);
			model.addAttribute(Constants.ERROR, bundle.getString("duplicate.record.error"));
		}catch(Exception ex) {
			logger.error("Error while adding circle by userId-->"+appContextVO.getUserId()+"<-- exception -->",ex);
			ResourceBundle bundle = ResourceBundle.getBundle("i18n/messages", locale);
			model.addAttribute(Constants.ERROR, bundle.getString("generic.error"));
		}
		zoneList = regionService.getAllActiveZones();
		model.addAttribute(Constants.ZONE_LIST, zoneList);
		
		stateList = regionService.getAllActiveStates();
		model.addAttribute(Constants.STATE_LIST, stateList);
	
	    districtList = regionService.getAllActiveDistricts();
	 	model.addAttribute(Constants.DISTRICT_LIST, districtList);
	 	
	 	circleList = regionService.getAllActiveCircles();
		model.addAttribute(Constants.CIRCLE_LIST, circleList);
		
		model.addAttribute(Constants.APP_CONTEXT, appContextVO);
		logger.info("Exit point #5 addCircle POST ");
		return "admin/circleList";
	}
	
	@RequestMapping(value={"/admin/region/removeCircle"}, method = RequestMethod.POST)
	public String removeCircle(HttpServletRequest request,
			HttpServletResponse response,Model model, Locale locale) {		
		
		logger.info("Entry point of removeCircle POST model -->"+model+"<-- locale -->"+locale+"<--");
		
		HttpSession session = request.getSession(false);
		
		if(null == session) {
			logger.error("Invalid session. session object is null");
			logger.info("Exit point #1 of removeCircle POST ");
			return "login";
		}
		
		AppContextVO appContextVO = (AppContextVO) session.getAttribute(Constants.APP_CONTEXT);
		
		if(null == appContextVO) {
			logger.error("Invalid session. appContextVO is null");
			logger.info("Exit point #2 of removeCircle POST ");
			return "login";
		}
		
		ArrayList<Integer> activeUserIdList = ConfigMap.getInstance().getActiveUsersUserIdList();
		
		if(!activeUserIdList.contains(appContextVO.getUserId())) {			
			logger.error("Invalid user. User is inactive");
			logger.info("Exit point #2.1 removeCircle POST");
			return "login";			
		}
		
		if(appContextVO.getRoleId() != Constants.SUPER_ADMIN) {
			SecurityLogger.getInstance().securityLog("Don't have authority to access -- removeCircle --"
					+ "Invalid login credentials --> userId ="+appContextVO.getUserId()+", emailAddress ="+appContextVO.getEmailAddress()+"<--");
			logger.info("Exit point #3 of removeCircle POST ");
			session.invalidate();
			return "login";
		}
		
		Integer circleId = 0;
		List<ZoneVO> zoneList = null;
		List<State> stateList = null;
		List<DistrictVO> districtList = null;
		List<CircleVO> circleList = null;
		try {
			circleId = Integer.parseInt(request.getParameter("circleId"));
		}catch(Exception ex) {
			logger.error("Invalid input for removeCircle of circleId -->"+request.getParameter("circleId")+"<-- userId -->"+appContextVO.getUserId()+"<--");		
			ResourceBundle bundle = ResourceBundle.getBundle("i18n/messages", locale);
			model.addAttribute(Constants.ERROR, bundle.getString("invalid.input"));
			
			zoneList = regionService.getAllActiveZones();
			model.addAttribute(Constants.ZONE_LIST, zoneList);
			
			stateList = regionService.getAllActiveStates();
			model.addAttribute(Constants.STATE_LIST, stateList);
			
			districtList = regionService.getAllActiveDistricts();
			model.addAttribute(Constants.DISTRICT_LIST, districtList);
			
			circleList = regionService.getAllActiveCircles();
			model.addAttribute(Constants.CIRCLE_LIST, circleList);
			
			model.addAttribute(Constants.APP_CONTEXT, appContextVO);
			
			logger.info("Exit point #4 of removeCircle POST ");
			return "admin/circleList";
		}

			
		boolean removeCircleFlag = regionService.removeCircle(appContextVO,circleId);
		
		if(!removeCircleFlag) {
			ResourceBundle bundle = ResourceBundle.getBundle("i18n/messages", locale);
			model.addAttribute(Constants.ERROR, bundle.getString("inuse.error"));
		}
		
		zoneList = regionService.getAllActiveZones();
		model.addAttribute(Constants.ZONE_LIST, zoneList);
		
		stateList = regionService.getAllActiveStates();
		model.addAttribute(Constants.STATE_LIST, stateList);
	
	    districtList = regionService.getAllActiveDistricts();
	 	model.addAttribute(Constants.DISTRICT_LIST, districtList);
	 	
	 	circleList = regionService.getAllActiveCircles();
		model.addAttribute(Constants.CIRCLE_LIST, circleList);
		
		model.addAttribute(Constants.APP_CONTEXT, appContextVO);
		
	 	logger.info("Exit point #5 of removeCircle POST ");
		return "admin/circleList";
	}

    	@RequestMapping(value = { "/admin/society/addSocietyGet" }, method = RequestMethod.GET)
	public String addSocietyGet(HttpServletRequest request, HttpServletResponse response, Society society, Model model,
			Locale locale) {

		logger.info("Entry point of addSociety GET locale-->" + locale + "<-- model-->" + model + "<-- society -->"
				+ society);
		HttpSession session = request.getSession(false);

		if (null == session) {
			logger.error("Invalid session. session object is null");
			logger.info("Exit point #1 of addSociety GET");
			return "login";
		}

		AppContextVO appContextVO = (AppContextVO) session.getAttribute(Constants.APP_CONTEXT);

		if (null == appContextVO) {
			logger.error("Invalid session. appContextVO is null");
			logger.info("Exit point #2 of addSociety GET ");
			return "login";
		}

		ArrayList<Integer> activeUserIdList = ConfigMap.getInstance().getActiveUsersUserIdList();
		
		if(!activeUserIdList.contains(appContextVO.getUserId())) {			
			logger.error("Invalid user. User is inactive");
			logger.info("Exit point #2.1 addSociety GET ");
			return "login";		
		}
		
		if (appContextVO.getRoleId() != Constants.SUPER_ADMIN) {
			SecurityLogger.getInstance()
					.securityLog("Don't have authority to access -- addSociety --"
							+ "Invalid login credentials --> userId =" + appContextVO.getUserId() + ", emailAddress ="
							+ appContextVO.getEmailAddress() + "<--");
			logger.info("Exit point #3 of addSociety GET");
			session.invalidate();
			return "login";
		}
	
		try {

			List<SocietyVO> societyList = societyService.getAllActiveSocieties();
			model.addAttribute(Constants.SOCIETY_LIST, societyList);

			List<ZoneVO> zoneList = regionService.getAllActiveZones();
			model.addAttribute(Constants.ZONE_LIST, zoneList);

			List<State> stateList = regionService.getAllActiveStates();
			model.addAttribute(Constants.STATE_LIST, stateList);

			List<DistrictVO> districtList = regionService.getAllActiveDistricts();
			model.addAttribute(Constants.DISTRICT_LIST, districtList);

			List<CircleVO> circleList = regionService.getAllActiveCircles();
			model.addAttribute(Constants.CIRCLE_LIST, circleList);

			List<BlockVO> blockList = regionService.getAllActiveBlock();
			model.addAttribute(Constants.BLOCK_LIST, blockList);

			List<VillageVO> villageList = regionService.getAllActiveVillage();
			model.addAttribute(Constants.VILLAGE_LIST, villageList);

			List<UserProfile> userList = societyService.getAllActiveUsers();
			model.addAttribute(Constants.USER_LIST, userList);

			model.addAttribute(Constants.SOCIETY, society);
			
			model.addAttribute(Constants.APP_CONTEXT, appContextVO);

		} catch (Exception ex) {
			logger.error("Error while get the addSociety", ex);
			ResourceBundle bundle = ResourceBundle.getBundle("i18n/messages", locale);
			model.addAttribute(Constants.ERROR, bundle.getString("unknown.error"));
			return "/errorPage";
		}
		logger.info("Exit point of addSociety GET ");
		return "admin/addSociety";

	}

	@RequestMapping(value = { "/admin/society/addSocietyPost" }, method = RequestMethod.POST)
	public String addSocietyPost(HttpServletRequest request, HttpServletResponse response, Society society, Model model,
			Locale locale) {

		logger.info("Entry point of addSociety POST locale-->" + locale + "<-- model-->" + model + "<-- society -->"
				+ society);

		HttpSession session = request.getSession(false);

		if (null == session) {
			logger.error("Invalid session. session object is null");
			logger.info("Exit point #1 of addSociety POST ");
			return "login";
		}

		AppContextVO appContextVO = (AppContextVO) session.getAttribute(Constants.APP_CONTEXT);

		if (null == appContextVO) {
			logger.error("Invalid session. appContextVO is null");
			logger.info("Exit point #2 of addSociety POST ");
			return "login";
		}

		ArrayList<Integer> activeUserIdList = ConfigMap.getInstance().getActiveUsersUserIdList();
		
		if(!activeUserIdList.contains(appContextVO.getUserId())) {			
			logger.error("Invalid user. User is inactive");
			logger.info("Exit point #2.1 addSociety POST ");
			return "login";		
		}
		
		if (appContextVO.getRoleId() != Constants.SUPER_ADMIN) {
			SecurityLogger.getInstance()
					.securityLog("Don't have authority to access -- addSociety --"
							+ "Invalid login credentials --> userId =" + appContextVO.getUserId() + ", emailAddress ="
							+ appContextVO.getEmailAddress() + "<--");
			logger.info("Exit point #3 of addSociety POST ");
			session.invalidate();
			return "login";
		}
		List<SocietyVO> societyList = null;

		HashMap<String, String> errorMap = SocietyValidator.validateSociety(society, locale);

		if (null != errorMap && errorMap.size() > 0) {
			model.addAttribute(Constants.ERROR_MAP, errorMap);

			model.addAttribute(Constants.SOCIETY, society);

			List<ZoneVO> zoneList = regionService.getAllActiveZones();
			model.addAttribute(Constants.ZONE_LIST, zoneList);

			List<State> stateList = regionService.getAllActiveStates();
			model.addAttribute(Constants.STATE_LIST, stateList);

			List<DistrictVO> districtList = regionService.getAllActiveDistricts();
			model.addAttribute(Constants.DISTRICT_LIST, districtList);

			List<CircleVO> circleList = regionService.getAllActiveCircles();
			model.addAttribute(Constants.CIRCLE_LIST, circleList);

			List<BlockVO> blockList = regionService.getAllActiveBlock();
			model.addAttribute(Constants.BLOCK_LIST, blockList);

			List<VillageVO> villageList = regionService.getAllActiveVillage();
			model.addAttribute(Constants.VILLAGE_LIST, villageList);

			List<UserProfile> userList = societyService.getAllActiveUsers();
			model.addAttribute(Constants.USER_LIST, userList);

			societyList = societyService.getAllActiveSocieties();
			model.addAttribute(Constants.SOCIETY_LIST, societyList);
			
			model.addAttribute(Constants.APP_CONTEXT, appContextVO);

			logger.info("Exit point #4 of addSociety POST ");
			return "admin/addSociety";
		}

		try {
			model.addAttribute(Constants.SOCIETY, society);
			societyService.addSociety(appContextVO, society);

			societyList = societyService.getAllActiveSocieties();
			model.addAttribute(Constants.SOCIETY_LIST, societyList);
		} catch (DuplicateRecordException dre) {
			logger.error("Error while adding society -->" + dre.getStatusMessage() + "<--");
			ResourceBundle bundle = ResourceBundle.getBundle("i18n/messages", locale);
			model.addAttribute(Constants.ERROR, bundle.getString("duplicate.record.error"));
		} catch (Exception ex) {
			logger.error("Error while adding society by userId-->" + appContextVO.getUserId() + "<-- exception -->",
					ex);
			ResourceBundle bundle = ResourceBundle.getBundle("i18n/messages", locale);
			model.addAttribute(Constants.ERROR, bundle.getString("generic.error"));
		}
		model.addAttribute(Constants.APP_CONTEXT, appContextVO);
		logger.info("Exit point #5 of addSociety POST ");
		return "admin/societyList";
	}