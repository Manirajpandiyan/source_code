	@Select("SELECT count(*) FROM circle WHERE state_id = #{stateId} and zone_id = #{zoneId} and district_id = #{districtId} and status='"+Constants.ACTIVE+"' and (circle_name_in_en = #{circleNameInEn} or circle_name_in_ta = #{circleNameInTa})")
	Integer getCircleByName(String circleNameInEn, String circleNameInTa, Integer stateId, Integer zoneId, Integer districtId);
	
	@Insert("INSERT INTO circle (circle_name_in_en, circle_name_in_ta, state_id, zone_id, district_id, status, created_by, created_date, last_updated_by, last_updated_date) "
			+ "VALUES(#{circleNameInEn}, #{circleNameInTa}, #{stateId}, #{zoneId}, #{districtId} , '"+Constants.ACTIVE+"', #{userId}, now(), #{userId}, now())")
	Integer addCircle(String circleNameInEn, String circleNameInTa, Integer stateId, Integer zoneId, Integer districtId,
			Integer userId);
	
	@Update("UPDATE circle SET status='"+Constants.DELETED+"', last_updated_by=#{userId}, last_updated_date=now() WHERE circle_id=#{circleId}")
	boolean removeCircle(Integer circleId, Integer userId);
	
	@Select("SELECT count(*) FROM block WHERE circle_id = #{circleId} and status = '"+Constants.ACTIVE+"'")
	Integer getCircleAlreadyInUseCount(Integer circleId);

    @Select("SELECT u.name_in_en, u.name_in_ta,s.*, v.village_name_in_en, v.village_name_in_ta FROM  society_details s, village v, user_profile u WHERE s.village_id = v.village_id AND s.society_secretary_id = u.user_id AND s.status='"+Constants.ACTIVE+"' AND v.status='"+Constants.ACTIVE+"' AND u.status='"+Constants.ACTIVE+"'")
	List<SocietyVO> getAllActiveSocieties();


    @Insert("INSERT INTO society_details (society_code, society_name_in_en, society_name_in_ta, society_secretary_id, deputation_secretary_id, max_num_of_surety, address, state_id, zone_id, district_id, circle_id, block_id, village_id, status, president_name_in_en, president_name_in_ta, appraiser_name_in_en, appraiser_name_in_ta, max_amount_per_gram_of_gold, field_manager_id, society_user_id, created_by, created_date, last_updated_by, last_updated_date)"
			+ " VALUES (#{societyCode}, #{societyNameInEn}, #{societyNameInTa}, #{societySecretaryId}, #{deputationSecretaryId}, #{maxNumOfSurety}, #{address}, #{stateId}, #{zoneId}, #{districtId}, #{circleId}, #{blockId}, #{villageId}, '"+Constants.ACTIVE+"', #{presidentNameInEn}, #{presidentNameInTa}, #{appraiserNameInEn}, #{appraiserNameInTa}, #{maxAmountPerGramOfGold}, #{fieldManagerId}, #{societyUserId}, #{createdBy}, #{createdDate}, #{lastUpdatedBy}, #{lastUpdatedDate})")
	Integer addSociety(Society society);

    @Update("UPDATE society_details set society_code=#{societyCode},society_name_in_en=#{societyNameInEn},society_name_in_ta=#{societyNameInTa}, society_secretary_id=#{societySecretaryId}"
			+ ", deputation_secretary_id=#{deputationSecretaryId}, max_num_of_surety=#{maxNumOfSurety}, "
			+ "address=#{address}, state_id=#{stateId}, zone_id=#{zoneId}, district_id=#{districtId},"
			+ " circle_id=#{circleId}, block_id=#{blockId}, village_id=#{villageId}, "
			+ "status='"+Constants.ACTIVE+"', "
			+ "president_name_in_en=#{presidentNameInEn}, president_name_in_ta=#{presidentNameInTa},"
			+ " appraiser_name_in_en=#{appraiserNameInEn}, appraiser_name_in_ta=#{appraiserNameInTa},"
			+ " max_amount_per_gram_of_gold=#{maxAmountPerGramOfGold}, field_manager_id=#{fieldManagerId}"
			+ ", society_user_id=#{societyUserId}, last_updated_by=#{lastUpdatedBy}, last_updated_date=#{lastUpdatedDate} "
			+ " where society_id = #{societyId}")
	boolean updateSociety(SocietyVO societyVO);