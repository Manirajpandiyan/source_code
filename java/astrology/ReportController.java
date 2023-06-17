package com.astromatch.controller;

import java.util.Locale;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.astromatch.common.AppContextVO;
import com.astromatch.common.Constants;
import com.astromatch.common.validator.TransactionReportInvoiceFilterValidator;
import com.astromatch.service.ReportService;
import com.astromatch.service.TransactionReportService;

import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import javax.servlet.http.Cookie;

import com.astromatch.dataaccess.model.admin.TransactionDetailsVO;
import com.astromatch.dataaccess.model.chat.ChatMessages;
import com.astromatch.dataaccess.model.reports.ChatHistoryReport;
import com.astromatch.dataaccess.valueobjects.chat.ChatMessagesVO;
import com.astromatch.service.AstrologerService;
import com.astromatch.utils.AstroMatchUtility;
import com.astromatch.utils.ConfigMap;
import com.astromatch.utils.SecurityLogger;

@Controller
public class ReportController {
	
	static final Logger logger = LoggerFactory.getLogger(ReportController.class);
	
	@Autowired
	private AstrologerService astrologerService;
	
	@Autowired
	private ReportService reportService;
	
	@Autowired
	private TransactionReportService transactionReportService;
	
	//REPORT CONTROLLER
	@RequestMapping(value = { "/reports" }, method = RequestMethod.GET)
	public String reports(HttpServletRequest request, HttpServletResponse response, Model model, Locale locale) {

		logger.info("Entry into the report with model->" + model + "<-locale->" + locale + "<-");
		AppContextVO appContextVO = null;
		HttpSession session = request.getSession(false);
		Cookie localeCookie = null;
		if(null == session) {
			AstroMatchUtility.oAuthAppId(request, model);
			logger.error("Invalid session. session object is null");
			logger.info("Exit point #1 reports GET ");
			return "login";
		}
		
		appContextVO = (AppContextVO) session.getAttribute(Constants.APP_CONTEXT);
		
		if(null != appContextVO) model.addAttribute(Constants.APP_CONTEXT, appContextVO);
		
		AstroMatchUtility.addCsrfToken(request, model);
		
		if(null == appContextVO) {
			logger.error("Invalid session. appContextVO is null");	
			if(null == locale || locale.toString().trim().equals("")) {
				localeCookie = new Cookie("locale","en");
				localeCookie.setPath("/");
				localeCookie.setHttpOnly(true);	
				response.addCookie(localeCookie);
			}
			AstroMatchUtility.oAuthAppId(request, model);
			logger.info("Exit point #2 reports GET ");
			return "login";
		} else if (appContextVO.getRoleId() == Constants.ROLE_PLATFORM_ADMIN) {
			logger.info("Exit point #3 reports GET ");
			return "platformAdmin/admin-report";
		} else if (appContextVO.getRoleId() == Constants.ROLE_ASTROLOGER) {
			logger.info("Exit point #4 reports GET ");
			return "astrologer/report";
		} else {
			logger.info("Exit point #5 reports GET ");
			return "user/user-report";
		}

	}
//	Chat History Report Controller
	@RequestMapping(value={"/reports/chat-history"}, method = RequestMethod.GET)
	public String chatHistoryReport(HttpServletRequest request,
			HttpServletResponse response,Model model, Locale locale) {		
		logger.info("Entry into the chatHistoryReport with model->" + model + "<-locale->" + locale + "<-");
		HttpSession session = request.getSession(false);
		AppContextVO appContextVO = null;
		Cookie localeCookie = null;
	    String languageCode=locale.toString().toUpperCase();
		
		if(null == session) {
			logger.error("Invalid session. session object is null");
		}else {
			appContextVO = (AppContextVO) session.getAttribute(Constants.APP_CONTEXT);
		}
		AstroMatchUtility.addCsrfToken(request, model);

		if(null == appContextVO) {
			logger.error("Invalid session. appContextVO is null");	
			if(null == locale || locale.toString().trim().equals("")) {
				localeCookie = new Cookie("locale","en");
				localeCookie.setPath("/");
				localeCookie.setHttpOnly(true);	
				response.addCookie(localeCookie);
			}
			AstroMatchUtility.oAuthAppId(request, model);
			logger.info("Exit point #1 of Chat history report GET, appContextVO -->"+appContextVO+"<--");
			return "login";
		}
		
		model.addAttribute(Constants.APP_CONTEXT, appContextVO);
	
		if(appContextVO.getRoleId() != Constants.ROLE_ASTROLOGER) {
			SecurityLogger.getInstance().securityLog("Don't have authority to access <-- Chat history report GET-->"
					+ "Invalid login credentials --> userId ="+appContextVO.getUserId()+", emailAddress ="+appContextVO.getEmailAddress()+"<--");
			if(null == locale || locale.toString().trim().equals("")) {
				localeCookie = new Cookie("locale","en");
				localeCookie.setPath("/");
				localeCookie.setHttpOnly(true);	
				response.addCookie(localeCookie);
			}
			AstroMatchUtility.oAuthAppId(request, model);
			logger.info("Exit point #2 of Chat history report GET");
			return "login";
		}
		Integer rowsPerPage=5;
		Integer pageNo=1;
		Integer chatId=0;
		List<ChatMessagesVO> chatMessagesVOList=null;
		
			List<ChatHistoryReport> chatHistoryReportList = null;
			try{
					if(null!=request.getParameter("rowsPerPage") && !request.getParameter("rowsPerPage").trim().equals("")) {
						
						if(Integer.parseInt(request.getParameter("rowsPerPage")) <= Integer.parseInt(ConfigMap.getInstance()
								.getConfigCategoryMap().get(Constants.VALIDATION_RULE).get("pageSize")))
							rowsPerPage=Integer.parseInt(request.getParameter("rowsPerPage"));	
						
						else model.addAttribute(Constants.PAGE_SIZE_ERROR, ConfigMap.getInstance().getConfigCategoryMap().get(Constants.VALIDATION_ERROR_MESSAGE).get(languageCode+".page.size.error"));
						
					}
				if(null!=request.getParameter("pageNo")) pageNo=Integer.parseInt(request.getParameter("pageNo"));	
				chatHistoryReportList = astrologerService.getChatHistoryReport(appContextVO, rowsPerPage, pageNo);
				
				if(null!=request.getParameter("chatId")&&!request.getParameter("chatId").trim().equals(""))chatId=Integer.parseInt(request.getParameter("chatId"));
				
				if(chatId!=0) {
					chatMessagesVOList=reportService.getChatHistoryReport(appContextVO,chatId);
					model.addAttribute(Constants.CHAT_MESSAGES_VO_LIST, chatMessagesVOList);
					model.addAttribute(Constants.READY, Constants.READY);
					
					if(null==chatMessagesVOList || chatMessagesVOList.isEmpty()) {
						model.addAttribute(Constants.CHAT_ERROR_MESSAGE,ConfigMap.getInstance().getConfigCategoryMap().get(Constants.VALIDATION_ERROR_MESSAGE)
								.get(languageCode + ".view.chat.history.error") );
					}
					
				}
			
			
				Integer numberOfPages=0;
				if(null!=chatHistoryReportList) {
					 if (chatHistoryReportList.get(0).getTotalPages() > 0) {
						    numberOfPages=chatHistoryReportList.get(0).getTotalPages();
				            List<Integer> pageNumbers = IntStream.rangeClosed(1, numberOfPages).boxed().collect(Collectors.toList());
				    		model.addAttribute(Constants.PAGE_NUMBERS, pageNumbers);
				        }
					}
				model.addAttribute(Constants.CHAT_HISTORY_REPORT_LIST, chatHistoryReportList);
				model.addAttribute(Constants.ROWS_PER_PAGE, rowsPerPage);
				model.addAttribute(Constants.PAGE_NO,pageNo);
				model.addAttribute(Constants.NUMBER_OF_PAGES,numberOfPages);
			}
			catch(Exception ex) {
				logger.error("Error while get the chat history report list",ex);
			}
			logger.info("Exit point #3 of Chat history report GET");
			return "astrologer/chat-history-report";
	
	}

	
	@RequestMapping(value={"/reports/view-chat-history"}, method = RequestMethod.GET)
	public String viewChatHistory(HttpServletRequest request,
			HttpServletResponse response,Model model, Locale locale) {		
		
		logger.info("Entry into the ReportController->viewChatHistory->model->" + model + "<-locale->" + locale + "<-");
		
		HttpSession session = request.getSession(false);
		AppContextVO appContextVO = null;
		Cookie localeCookie = null;
		String languageCode = locale.toString().toUpperCase();
		
		if(null == session) {
			logger.error("Invalid session. session object is null");
		}else {
			appContextVO = (AppContextVO) session.getAttribute(Constants.APP_CONTEXT);
		}
		AstroMatchUtility.addCsrfToken(request, model);

		if(null == appContextVO) {
			logger.error("Invalid session. appContextVO is null");
			if(null == locale || locale.toString().trim().equals("")) {
				localeCookie = new Cookie("locale","en");
				localeCookie.setPath("/");
				localeCookie.setHttpOnly(true);	
				response.addCookie(localeCookie);
			}
			AstroMatchUtility.oAuthAppId(request, model);
			logger.info("Exit point #1 of ReportController->viewChatHistory->appContextVO->"+appContextVO+"<--");
			return "login";
		}
		
		model.addAttribute(Constants.APP_CONTEXT, appContextVO);
	
		if(appContextVO.getRoleId() != Constants.ROLE_PLATFORM_ADMIN && appContextVO.getRoleId() != Constants.ROLE_ASTROLOGER 
				&& appContextVO.getRoleId() != Constants.ROLE_USER) {
			SecurityLogger.getInstance().securityLog("Don't have authority to access<--ReportController->viewChatHistory-->"
					+ "Invalid login credentials->userId ="+appContextVO.getUserId()+", emailAddress ="+appContextVO.getEmailAddress()+"<--");
			if(null == locale || locale.toString().trim().equals("")) {
				localeCookie = new Cookie("locale","en");
				localeCookie.setPath("/");
				localeCookie.setHttpOnly(true);	
				response.addCookie(localeCookie);
			}
			AstroMatchUtility.oAuthAppId(request, model);
			logger.info("Exit point #2 of ReportController->viewChatHistory");
			return "login";
		}
	
		Integer chatId=0;
		List<ChatMessagesVO> chatMessagesVOList=null;
		List<TransactionDetailsVO> transactionDetailsVOList=null;
		Integer pageSize=10;
		Integer pageNo=1;
	    String service="";
	    
	    String transactionFromDate="";
	    String transactionToDate="";
		Integer numberOfPages=0;
		try {
			if(null!=request.getParameter("chatId")&&!request.getParameter("chatId").trim().equals(""))chatId=Integer.parseInt(request.getParameter("chatId"));
			if(chatId==0)		{
				logger.info("Exit point #3 of ReportController->viewChatHistory->chatId->"+chatId);
				return"error-page";
			}
			else {
				chatMessagesVOList=reportService.getChatHistoryReport(appContextVO,chatId);
				
				if(null==chatMessagesVOList || chatMessagesVOList.isEmpty()) {
					model.addAttribute(Constants.CHAT_ERROR_MESSAGE,ConfigMap.getInstance().getConfigCategoryMap().get(Constants.VALIDATION_ERROR_MESSAGE)
							.get(languageCode + ".view.chat.history.error") );
				}
				
				if(appContextVO.getRoleId().equals(Constants.ROLE_PLATFORM_ADMIN)) {
					
					if(null!=request.getParameter("pageSize") && !request.getParameter("pageSize").trim().equals("")) {
						if(Integer.parseInt(request.getParameter("pageSize")) <= Integer.parseInt(ConfigMap.getInstance()
								.getConfigCategoryMap().get(Constants.VALIDATION_RULE).get("pageSize")))
							pageSize=Integer.parseInt(request.getParameter("pageSize"));
						
						else model.addAttribute(Constants.PAGE_SIZE_ERROR, ConfigMap.getInstance().getConfigCategoryMap().get(Constants.VALIDATION_ERROR_MESSAGE).get(languageCode+".page.size.error"));
					}
					if(null!=request.getParameter("pageNo") && !request.getParameter("pageNo").trim().equals("")) pageNo=Integer.parseInt(request.getParameter("pageNo"));
					if(null!=request.getParameter("service") && !request.getParameter("service").trim().equals("")) service=request.getParameter("service");
					if(null!=request.getParameter("transactionFromDate") && !request.getParameter("transactionFromDate").trim().equals("")) transactionFromDate=request.getParameter("transactionFromDate");
					if(null!=request.getParameter("transactionToDate") && !request.getParameter("transactionToDate").trim().equals("")) transactionToDate=request.getParameter("transactionToDate");
					
					model.addAttribute(Constants.SERVICE, service);
					model.addAttribute(Constants.TRANSACTION_FROM_DATE, transactionFromDate);
					model.addAttribute(Constants.TRANSACTION_TO_DATE, transactionToDate);
					
					HashMap<String,String> errorMap = TransactionReportInvoiceFilterValidator.validateTransactionReportFilter(service, transactionFromDate,transactionToDate, languageCode);

					if(errorMap.size()>0)
					{
						model.addAttribute(Constants.ERROR_MAP, errorMap);
						service="";
						transactionFromDate="";
						transactionToDate="";
					}
					else {
						model.addAttribute(Constants.CHAT_MESSAGES_VO_LIST, chatMessagesVOList);
						model.addAttribute(Constants.READY, Constants.READY);
					}
					
					transactionDetailsVOList=transactionReportService.getAllTransactionDetails(appContextVO,pageSize,pageNo,service,transactionFromDate,transactionToDate);
					
					if(null!=transactionDetailsVOList) {
					 if (transactionDetailsVOList.get(0).getTotalPages() > 0) {
						    numberOfPages=transactionDetailsVOList.get(0).getTotalPages();
				            List<Integer> pageNumbers = IntStream.rangeClosed(1, numberOfPages).boxed().collect(Collectors.toList());
				    		model.addAttribute(Constants.PAGE_NUMBERS, pageNumbers);
				    		model.addAttribute(Constants.TOTAL_SIZE,transactionDetailsVOList.get(0).getTotalSize());
				        }
					}
					model.addAttribute(Constants.APP_CONTEXT, appContextVO);
					model.addAttribute(Constants.TRANSACTION_DETAILS_VO_LIST, transactionDetailsVOList);
					model.addAttribute(Constants.PAGESIZE, pageSize);
					model.addAttribute(Constants.PAGE_NO,pageNo);
					model.addAttribute(Constants.NUMBER_OF_PAGES,numberOfPages);
					
					logger.info("Exit point #4 of  ReportController->viewChatHistory->chatMessagesVOList size="+chatMessagesVOList.size());
					return "platformAdmin/admin-transaction-report";
				}
			}
		}catch(NumberFormatException nfe) {
			logger.error("Error while retrive #5  ReportController->viewChatHistory->nfe->",nfe);
			return"error-page";
		}catch(Exception ex) {
			logger.error("Error while retrive #6  ReportController->viewChatHistory->ex->",ex);
			return"error-page";
		}
		logger.info("Exit point #7 of ReportController->viewChatHistory->appContextVO userId->"+appContextVO.getUserId());
		return "error-page";
	}
}
