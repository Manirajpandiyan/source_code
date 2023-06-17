	@Override
	public boolean addCircle(AppContextVO appContextVO, Circle circle) throws DuplicateRecordException {
		logger.info("Entry point of addCircle with circle-->"+circle+"<-- userId -->"+appContextVO.getUserId());
		Integer count = 0;
		try {
			count = regionDataMapper.getCircleByName(circle.getCircleNameInEn(), circle.getCircleNameInTa(), circle.getStateId(), circle.getZoneId(), circle.getDistrictId());
			if(count > 0) throw new DuplicateRecordException(Constants.ERROR_CODE_403, "Record already exists for circleNameInTa -->"+circle.getCircleNameInTa()+"<-- circleNameInEn -->"+circle.getCircleNameInEn());			
			count = 0;
			count = regionDataMapper.addCircle(circle.getCircleNameInEn(), circle.getCircleNameInTa(), circle.getStateId(), circle.getZoneId(), circle.getDistrictId(), appContextVO.getUserId());
		}catch(DuplicateRecordException dre) {
			throw new DuplicateRecordException(Constants.ERROR_CODE_403, "Record already exists for circleNameInTa -->"+circle.getCircleNameInTa()+"<-- circleNameInEn -->"+circle.getCircleNameInEn());
		}catch(Exception ex) {
			logger.error("Error while adding circle by userId-->"+appContextVO.getUserId()+"<-- exception -->",ex);
		}
		logger.info("Exit point of addCircle");		
		if(count>0) return true;
		else return false;
	}
	
	@Override
	public boolean removeCircle(AppContextVO appContextVO, Integer circleId) {
		logger.info("Entry point of removeCircle with circleId-->"+circleId+"<-- userId -->"+appContextVO.getUserId());
		boolean flag = false;
		Integer circleAlreadyInUseCount = 0;
		try {
			circleAlreadyInUseCount = regionDataMapper.getCircleAlreadyInUseCount(circleId);
			logger.info("circleAlreadyInUseCount -->"+circleAlreadyInUseCount+"<--");
			if(circleAlreadyInUseCount == 0)flag = regionDataMapper.removeCircle(circleId, appContextVO.getUserId());
			else return flag;
			
		}catch(Exception ex) {
			logger.error("Error while removing the circle for circleId -->"+circleId+"<-- userId -->"+appContextVO.getUserId()
			+"<-- exception -->",ex);
		}
		logger.info("Exit point of removeCircle with circleId-->"+circleId+"<-- userId -->"+appContextVO.getUserId());
		return flag;
	}

    @Override
	public List<SocietyVO> getAllActiveSocieties() {
		logger.info("Entry point of getAllActiveSocieties");
		List<SocietyVO> activeSocietyList = null;
		try {
			activeSocietyList = societyDataMapper.getAllActiveSocieties();
			
		}catch(Exception ex) {
			logger.error("Error while retrieving all active society -->",ex);
		}
		logger.info("Exit point of getAllActiveSocieties");
		return activeSocietyList;
	}


    	@Override
	public boolean addSociety(AppContextVO appContextVO, Society society) throws DuplicateRecordException {
		logger.info("Entry point of addSociety with society"+society+"<-- userId -->"+appContextVO.getUserId());
		boolean flag = false ;
		Integer count = 0;
		try {
			count = societyDataMapper.getSocietyByName(society.getSocietyNameInTa(), society.getSocietyNameInEn(), society.getStateId(), society.getZoneId(), society.getDistrictId(), society.getCircleId(), society.getBlockId(), society.getVillageId());
			if(count > 0) throw new DuplicateRecordException(Constants.ERROR_CODE_403, "Record already exists for societyNameInTa -->"+society.getSocietyNameInTa()+"<-- societyNameInEn -->"+society.getSocietyNameInEn());			
			
			count = 0;
			society.setCreatedBy(appContextVO.getUserId());
			society.setCreatedDate(new Date());
			society.setLastUpdatedBy(appContextVO.getUserId());
			society.setLastUpdatedDate(new Date());
			
			if(society.getDeputationSecretaryId()==0) society.setDeputationSecretaryId(null);
			
			count = societyDataMapper.addSociety(society);
		}catch(DuplicateRecordException dre) {
			throw new DuplicateRecordException(Constants.ERROR_CODE_403, "Record already exists for societyNameInTa -->"+society.getSocietyNameInTa()+"<-- societyNameInEn -->"+society.getSocietyNameInEn());
		}catch(Exception ex) {
			logger.error("Error while adding society by userId-->"+appContextVO.getUserId()+"<-- exception -->",ex);
		}
		logger.info("Exit point of addSociety of count-->"+count+"<--");
		if(count>0) return true;
		else 
			return flag;
	}

    @Override
	public SocietyVO updateSociety(AppContextVO appContextVO, SocietyVO societyVO) {
		logger.info("Entry point of updateSociety, appContextVO -->"+appContextVO.getUserId()+"<--societyVO-->"+societyVO+"<--");
		boolean updateStatus = false;
		try {
			if(societyVO.getDeputationSecretaryId() == null || societyVO.getDeputationSecretaryId()<=0) societyVO.setDeputationSecretaryId(null);
			societyVO.setLastUpdatedBy(appContextVO.getUserId());
			societyVO.setLastUpdatedDate(new Date());
			updateStatus = societyDataMapper.updateSociety(societyVO);
			
		}catch(Exception ex) {
			logger.error("Error while updateSociety by user -->"+appContextVO.getUserId(),ex);
		}
		logger.info("Exit point of updateSociety");
		if(updateStatus) return societyVO;
		else return null;
	}
	