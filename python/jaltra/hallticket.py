@utils.route('/generate-hallticket')
def check_sehuduled_job():
     exams = db.session.query(Exams).filter(Exams.is_active==True).all()
     hallticketInstruction = Guides.query.filter(Guides.guide_type == 'Hall ticket').all()
     for instructions in hallticketInstruction:
         guide_type = instructions.content
         title = instructions.title
     for exam in exams:
        if exam.hall_ticket_generation_date and exam.is_hall_ticket_generated==False:
            exam_applications = db.session.query(Student_exam_application).filter(Student_exam_application.exam_id==exam.exam_id, Student_exam_application.is_paid==True).all()
            print(exam_applications)
            folder_path = os.path.join(current_app.root_path,"static/jaltra/documents/hallticket",exam.exam_name)
            if not os.path.exists(folder_path):
                os.mkdir(folder_path)
            for exam_application in exam_applications:
                logoPath = os.path.join(current_app.root_path, "static/jaltra/image/logo-xl-white.png")
                sealPicPath = os.path.join(current_app.root_path,"static/jaltra/image/JALTRA_PNG.png")
                if exam_application.image.image_path:
                    proPicPath = os.path.join(current_app.root_path,"static/jaltra/image/profile_pic",exam_application.image.image_path)
                else: 
                    proPicPath = ''
                #set values
                exam_name = exam_application.exam.exam_name
                test_level = exam_application.exam_level.level_name
                roll_no = exam_application.application_roll_no
                first_name = exam_application.application_info_json['firstname']
                last_name = exam_application.application_info_json['lastname']
                gender = exam_application.application_info_json['gender']
                date_of_birth = exam_application.application_info_json['dob']
                exam_date = exam_application.exam.exam_date.strftime("%d %B %Y")
                test_center = exam_application.test_center.center_name
                html = render_template("students/hallticket.html", test_level=test_level, roll_no=roll_no, first_name=first_name, last_name=last_name, gender=gender, date_of_birth=date_of_birth,exam_date=exam_date,test_center=test_center, exam_name=exam_name, logoPicString=image_file_path_to_base64_string(logoPath), proPicString=image_file_path_to_base64_string(proPicPath), sealPicImage=image_file_path_to_base64_string(sealPicPath), guide_type=guide_type, title=title)
                pdfkit.from_string(html, "app/static/jaltra/documents/hallticket/"+exam.exam_name+"/"+exam_application.application_roll_no+".pdf")
                exam_application.hall_ticket_file_path = exam.exam_name+"/"+exam_application.application_roll_no+".pdf"
                db.session.commit()
                exam.is_hall_ticket_generated=True
            db.session.commit()
            return "Hallticket generated successfully" 
        else: return "Hallticket already generated"       
