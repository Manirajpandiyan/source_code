from flask import render_template, Blueprint, abort, current_app, redirect, url_for, flash, jsonify, request, json
from flask_login import current_user, login_required
from datetime import datetime
from cryptography.fernet import Fernet
import requests
from sqlalchemy import cast, Integer, or_
from app import db

from app.exam.models import Exams, Exam_level_map, Exam_test_center_org_map, Refund_details
from app.exam_application.models import Student_exam_application
from app.user.models import Users
from app.newsandannouncements.models import News_and_Announcements

main = Blueprint('main', __name__)


@main.route('/')
@main.route('/current-exam')
@login_required
def current_exam():
    if not current_user.role_id == current_app.config['STUDENT_ID']:
        abort(403)
    encrypted_key = current_app.config['CRYPT_KEY']
    f = Fernet(encrypted_key)
    user_id = str(f.encrypt(str(current_user.user_id).encode()), 'utf-8')
    exams = Exams.query.filter(Exams.is_active == True, Exams.booking_opening_date <=
                               datetime.now()).order_by(Exams.exam_date.asc()).all()
    exams_list = []
    for exam in exams:
        exam_application = Student_exam_application.query.filter(
            Student_exam_application.exam_id == exam.exam_id, Student_exam_application.user_id == current_user.user_id, Student_exam_application.is_paid == True).first()
        if exam_application or (exam.booking_closing_date >= datetime.now() and int(exam.no_of_seats_available) > 0):
            exam_dict = {}
            exam_dict['exam_id'] = exam.exam_id
            exam_dict['exam_name'] = exam.exam_name
            exam_dict['exam_date'] = exam.exam_date
            exam_dict['booking_opening_date'] = exam.booking_opening_date
            exam_dict['booking_closing_date'] = exam.booking_closing_date
            exam_dict['seats_available'] = exam.no_of_seats_available
            exam_dict['exam_levels'] = ', '.join([exam_level_map.exam_level.level_name for exam_level_map in Exam_level_map.query.filter_by(
                exam_id=exam.exam_id).order_by(Exam_level_map.level_id.asc())])
            # exam_list.extend([exam.exam_name, exam.exam_date, exam.is_active, exam.booking_opening_date, exam.booking_closing_date, exam.no_of_seats_available])
            exam_application = Student_exam_application.query.join(Exams).join(Users).filter(
                Exams.exam_id == exam.exam_id, Users.user_id == current_user.user_id).first()
            print(exam_application)
            if exam_application:
                exam_dict['already_saved'] = True
                exam_dict['is_paid'] = exam_application.is_paid
                if exam_application.is_paid:
                    exam_dict['applied_on'] = exam_application.applied_date
                    exam_dict['exam_level'] = exam_application.exam_level.level_name
                    exam_dict['exam_center'] = exam_application.test_center.center_name
                    exam_dict['hall_ticket_generation_date'] = exam.hall_ticket_generation_date
                    exam_dict['is_generated'] = exam.is_hall_ticket_generated
                    exam_dict['file_path'] = exam_application.hall_ticket_file_path
            exams_list.append(exam_dict)
    exam_application = Student_exam_application.query.filter(or_(Student_exam_application.exam_id == 43, Student_exam_application.exam_id == 44),
                                                             Student_exam_application.user_id == current_user.user_id, Student_exam_application.is_paid == True).first()
    if exam_application and exam_application.refund_or_continue == "CARRY_FORWARD":
        return render_template('students/student_current_exam.html', current_exam_nav="active", refund_carry_forward=exam_application.refund_or_continue)
    return render_template('students/student_current_exam.html', exams_list=exams_list, current_exam_nav="active")

@main.route('/admin')
@login_required
def admin_home():
    if not current_user.role_id == current_app.config['ADMIN_ID']:
        abort(403)
    return render_template("admin/admin_home.html", home="active")


@main.route('/welcome')
def welcome():
    if current_user.is_authenticated:
        if current_user.role_id == current_app.config['ADMIN_ID']:
            return redirect(url_for('main.admin_home'))
        elif current_user.role_id == current_app.config['STUDENT_ID']:
            return redirect(url_for('main.current_exam'))
    exams = Exams.query.filter(Exams.is_active == True, Exams.booking_opening_date <= datetime.now(
    ), cast(Exams.no_of_seats_available, Integer) > 0).order_by(Exams.exam_id.asc()).all()
    exams_list = []
    for exam in exams:
        if exam.booking_closing_date >= datetime.now():
            exam_dict = {}
            exam_dict["registered_payment_pending"] = Student_exam_application.query.filter(
                Student_exam_application.exam_id == exam.exam_id, Student_exam_application.is_paid != True).count()
            exam_dict['exam_name'] = exam.exam_name
            exam_dict['seats_available'] = exam.no_of_seats_available
            exam_dict['exam_levels'] = ', '.join([exam_level_map.exam_level.level_name for exam_level_map in Exam_level_map.query.filter_by(
                exam_id=exam.exam_id).order_by(Exam_level_map.level_id.asc())])
            exams_list.append(exam_dict)
    flash_news = ' | '.join([news.content for news in News_and_Announcements.query.filter(
        News_and_Announcements.is_active == True, News_and_Announcements.news_type == "Flash")])
    website_content = News_and_Announcements.query.filter(News_and_Announcements.is_active == True, News_and_Announcements.news_type == "Website content")
    print('<<flash>>', flash_news)
    return render_template("website.html", site_key=current_app.config['GOOGLE_RECAPTCHA_SITE_KEY'], flash_news=flash_news, exams_list=exams_list, website_content=website_content)


@main.route('/FAQ')
def faq():
    return render_template("faq.html")


@main.route('/terms-and-conditions')
def terms_and_conditions():
    return render_template("terms.html")


@main.route('/pay-terms')
def pay_terms():
    return render_template("pay_terms.html")


@main.route('/privacy-policy')
def privacy_policy():
    return render_template("privacy_3.html")
