import random
from cryptography.fernet import Fernet
from datetime import datetime
from werkzeug.urls import url_parse
import requests

from flask import render_template, redirect, url_for, flash, request, Blueprint, current_app, abort, jsonify, json
from flask_login import current_user, logout_user, login_user, login_required
from flask_mail import Message

from app import db, mail
from app.user.models import Users, Students
from app.auth.models import Validation_code_details
from app.utils.models import Email_templates, Email_messages, Email_attribute

# from itsdangerous import JSONWebSignatureSerializer

@auth.route('/register', methods=['GET', 'POST'])
def register():
    if request.method=="POST":
        encrypted_key = Fernet.generate_key()
        f = Fernet(encrypted_key)
        user = Users.query.filter_by(primary_email_id=request.form["email"]).first()
        if user:
            if user.is_active:
                return jsonify({'error':'Email already registered'}),409
            else:
                user.first_name = request.form['firstname']
                user.last_name = request.form['lastname']
                user.password = str(f.encrypt(bytes(request.form['password'], 'utf-8')), 'utf-8')
                user.encrypted_key = str(encrypted_key, 'utf-8')
                user.role_id = current_app.config['STUDENT_ID']
                db.session.commit()
        else:
            db.session.add(Users(first_name=request.form['firstname'], last_name=request.form['lastname'], primary_email_id=request.form['email'], password=str(
                f.encrypt(bytes(request.form['password'], 'utf-8')), 'utf-8'), encrypted_key=str(encrypted_key, 'utf-8'), role_id=3))
            db.session.commit()
        template = Email_templates.query.filter_by(template_name="REGISTRATION_OTP").first()
        if send_mail(request.form['email'], template, "OTP verification", "REGISTRATION_OTP"):
            token = encrypt_token(request.form['email'])
            return jsonify({'data':token, 'message':'otp has send to mail'}),200
        else:
            return jsonify({'error':'Some problems occured, Plese try again'}), 500
        # flash('We are facing some issues.please try again later', "secondary")
    return render_template('main.welcome')

@auth.route('/sign-in', methods=['GET', 'POST'])
def sign_in():
    if request.method=="POST":
        try:
            payload = {'response':request.form['token'], 'secret':current_app.config['GOOGLE_RECAPTCHA_SECRET_KEY']}
            response = requests.post("https://www.google.com/recaptcha/api/siteverify", payload)
            response_text = json.loads(response.text)
            print("response", response_text)
            if response_text['success'] and response_text['score']>=0.7:
                user = Users.query.filter(Users.primary_email_id==request.form['email'], Users.is_active==True).first()
                if user:
                    f=Fernet(bytes(user.encrypted_key, 'utf-8'))
                    db_password = f.decrypt(bytes(user.password,'utf-8'))
                    if request.form['password'] == db_password.decode():
                        # next_page = request.args.get('next')
                        login_user(user, remember=False)
                        # if not next_page or url_parse(next_page).netloc != '':
                        #     return redirect(url_for(next_page))
                        if user.role_id==current_app.config['ADMIN_ID']:
                            return jsonify({'user':'admin'}), 200
                        else:
                            return jsonify({'user':'student'}), 200
                    else:
                        return jsonify({'error':'Email or password is incorrect'}), 401
                else:
                    return jsonify({'error':"User is not yet registed"}), 401
            else:
                return jsonify({'error':"You are recognized as robot, if human plaese try again!!"}), 403
        except Exception as e:
            print(e)
            return jsonify({'error':'Some error has occured. Please try one more time'}), 500
    return redirect(url_for("main.welcome"))


@auth.route('/forget-password', methods=['GET', 'POST'])
def forget_password():
    if request.method=="POST":
        user = Users.query.filter(Users.primary_email_id==request.form['email'], Users.is_active==True).first()
        if user:
            template = Email_templates.query.filter_by(template_name="FORGET_PASSWORD_OTP").first()
            try:
                subject = "OTP verification"
                send_mail(request.form['email'], template, subject, "FORGET_PASSWORD_OTP")
                token = encrypt_token(request.form['email'])
                return jsonify({'token':token, 'message':'OTP has been successfully sent'}), 201
            except Exception as e:
                print(e)
                return jsonify({'error':'Some error has occured. Please try one more time'}), 500
                # flash("Some error has occured. Please try one more time", "secondary")
        else:
            return jsonify({'error':'Enterd email not yet registered'}), 401
    return redirect(url_for("main.welcome"))


@auth.route('/verify_identity', methods=['GET', 'POST'])
def verify_identity():
    key = current_app.config['CRYPT_KEY']
    b = Fernet(key)
    email = b.decrypt(request.form['token'].encode()).decode()
    if request.method=="POST":
        print(email)
        user = Users.get_user(email)
        validation_code_detail = Validation_code_details.query.filter(Validation_code_details.user_id==user.user_id, Validation_code_details.validation_category=='FORGET_PASSWORD_OTP').order_by(Validation_code_details.valid_till.desc()).first()
        print(validation_code_detail.validation_code_id)
        if(validation_code_detail.code == request.form['otp']):
            if validation_code_detail.valid_till>datetime.now():
                validation_code_detail.verification_status="VERIFIED"
                validation_code_detail.verification_date=datetime.now()
                db.session.commit()
                return jsonify({'token':request.form['token'], 'message':'Otp validation success'}), 201
            else:
                return jsonify({'error':'OTP expired'}), 422
        else:
            return jsonify({'error':'Invalid otp'}), 422
    return redirect(url_for("main.welcome"))

@auth.route('/change_password', methods=['POST', 'GET'])
def change_password():
    if request.method=="POST":
        try:
            email = decrypt_token(request.form['token'])
            user = Users.get_user(email)
            encrypted_key = Fernet.generate_key()
            f = Fernet(encrypted_key)
            user.password = str(f.encrypt(bytes(request.form['password'], 'utf-8')), 'utf-8')
            user.encrypted_key = str(encrypted_key, 'utf-8')
            db.session.commit()
            return jsonify({'message':'changed password successfully'}), 201
        except Exception as e:
            print('exception', e)
            return jsonify({'error':'Some error has occured, please try again'}), 500
    return redirect(url_for("main.welcome"))

@auth.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('main.welcome'))
