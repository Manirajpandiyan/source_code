	public boolean addCircle(AppContextVO appContextVO, Circle circle) throws DuplicateRecordException;
	
	public boolean removeCircle(AppContextVO appContextVO, Integer circleId);

    public SocietyVO updateSociety(AppContextVO appContextVO, SocietyVO societyVO);

    public boolean addSociety(AppContextVO appContextVO, Society society) throws DuplicateRecordException;

    public List<SocietyVO> getAllActiveSocieties();