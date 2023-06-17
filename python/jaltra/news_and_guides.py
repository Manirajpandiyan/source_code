import os
import secrets
from flask import Blueprint, render_template, redirect, url_for, request, current_app, abort
from datetime import datetime
from app import db
from flask_login import login_required, current_user
from sqlalchemy import func

from app.newsandannouncements.forms import NewsPostForm, EditNewsForm, NewGuideForm, EditGuideForm
from app.newsandannouncements.models import News_and_Announcements, Tag_category, Guides
from app.utils.models import Status_lookup
from app.exam.models import Exams

news = Blueprint('news', __name__)

def save_news_file(form_file):
    try:
        random_hex=secrets.token_hex(8)
        _,f_ext=os.path.splitext(form_file.filename)
        doc_fn = random_hex + f_ext
        news_doc_path = os.path.join(current_app.root_path,"static/jaltra/documents/news_and_announcements", doc_fn)
        form_file.save(news_doc_path)
        return doc_fn
    except Exception as e:
        print("error while uploading documents", "<<error>>>", e)
        return False

def replace_news_file(existing_fn, form_file):
    _,f_ext= os.path.splitext(form_file.filename)
    f_name = existing_fn.rsplit(".",1)
    file_path=os.path.join(current_app.root_path,"static/jaltra/documents/news_and_announcements", existing_fn)
    if os.path.exists(file_path):
        try:
           os.remove(file_path)
           picture_fn =  f_name[0] + f_ext
           picture_path=os.path.join(current_app.root_path,"static/jaltra/documents/news_and_announcements", picture_fn)
           form_file.save(picture_path)
           return picture_fn
        except Exception as e:
           print("File could not be deleted", e)
           return False
    else:
        print("The file does not exist")
        return False

@news.route('/news-create-news', methods=['GET', 'POST'])
@login_required
def create_news():
    if not current_user.role_id == current_app.config['ADMIN_ID']:
        abort(403)
    form = NewsPostForm()
    if form.validate_on_submit():
        print("<<<form data>>", form.data)
        tag_id = None
        if form.tags.data:
            tag = Tag_category.query.filter_by(tag_name=form.tags.data.lower()).first()
            if tag:
                tag_id = tag.tag_id
            else:
                db.session.add(Tag_category(tag_name=form.tags.data.lower()))
                db.session.commit()
                tag = Tag_category.query.filter_by(tag_name=form.tags.data.lower()).first()
                tag_id = tag.tag_id
        if form.upload.data:
            doc_fn = save_news_file(form.upload.data)
            if doc_fn:
                Status_lookup.add_status(status_name=form.title.data, status_module_mapping="news and announcements",  is_active=True, created_by=current_user.user_id, last_updated_by=current_user.user_id, last_updated_date=datetime.now())
                status = Status_lookup.get_status(name=form.title.data)
                db.session.add(News_and_Announcements(
                    title=form.title.data, news_type=form.news_type.data,
                    content = form.content.data,
                    publish_start_date = form.auto_publish_start_date.data,
                    publish_end_date = form.auto_publish_end_date.data, file_path=doc_fn, link = form.additional_link.data, created_by=2, last_updated_by=2,
                    additional_information = form.additional_information.data, status_lookup_id = status.status_id, tag_id=tag_id))
                db.session.commit()
                return redirect(url_for("news.news_listing"))
            else:
                print("error while uploading documents")
                return redirect(url_for("news.create_news"))
        else:
            Status_lookup.add_status(status_name=form.title.data, status_module_mapping="news and announcements",  is_active=True, created_by=current_user.user_id, last_updated_by=current_user.user_id, last_updated_date=datetime.now())
            status = Status_lookup.get_status(name=form.title.data)
            db.session.add(News_and_Announcements(
                title=form.title.data, news_type=form.news_type.data,
                content = form.content.data,
                publish_start_date = form.auto_publish_start_date.data,
                publish_end_date = form.auto_publish_end_date.data, link = form.additional_link.data, created_by=2, last_updated_by=2,
                additional_information = form.additional_information.data, status_lookup_id = status.status_id, tag_id=tag_id))
            db.session.commit()
            return redirect(url_for("news.news_listing"))
    print(form.errors)
    return render_template("admin/admin_create_news.html", form=form, news_nav="active")


@news.route('/news-listing', methods=['GET', 'POST'])
@login_required
def news_listing():
    if not current_user.role_id == current_app.config['ADMIN_ID']:
        abort(403)
    page = request.args.get('page', 1, type=int)
    if request.method=='POST':
        if "search" in request.form and request.form['search']!="":
            search_value = "%{}%".format(request.form["search"].lower())
            print(search_value)
            news_list = News_and_Announcements.query.filter(func.lower(News_and_Announcements.title).contains(search_value)).order_by(News_and_Announcements.last_updated_on.desc()).all()
            return render_template("admin/admin_news_listing.html", news_list=news_list, news_nav="active", search_value=request.form["search"])
        #filter operation
        if "status-active" in request.form:
            news_list = News_and_Announcements.query.filter_by(is_active=True).order_by(News_and_Announcements.last_updated_on.desc()).all()
            print(news_list)
            return render_template("admin/admin_news_listing.html", news_list=news_list, news_nav="active", active='checked')
        elif "status-inactive" in request.form:
            news_list = News_and_Announcements.query.filter_by(is_active=False).order_by(News_and_Announcements.last_updated_on.desc()).all()
            print(news_list)
            return render_template("admin/admin_news_listing.html", news_list=news_list, news_nav="active", inactive='checked')
        else:
            news_list = News_and_Announcements.query.order_by(News_and_Announcements.last_updated_on.desc()).paginate(per_page=10, page=page)
    else:
        news_list = News_and_Announcements.query.order_by(News_and_Announcements.last_updated_on.desc()).paginate(per_page=10, page=page)
    print(news_list)
    return render_template("admin/admin_news_listing.html", news_list=news_list, news_nav="active")


@news.route('/news-edit-news/<int:news_id>', methods=['GET', 'POST'])
@login_required
def edit_news(news_id):
    if not current_user.role_id == current_app.config['ADMIN_ID']:
        abort(403)
    form = EditNewsForm()
    news = News_and_Announcements.query.filter_by(news_id=news_id).first()
    if form.validate_on_submit():
        news.title = form.title.data
        news.content = form.content.data
        news.publish_start_date = form.auto_publish_start_date.data
        news.publish_end_date = form.auto_publish_end_date.data
        news.link = form.additional_link.data
        news.additional_information = form.additional_information.data
        news.last_updated_on = datetime.now()
        news.news_type = form.news_type.data
        if form.tags.data:
            tag = Tag_category.query.filter_by(tag_name=form.tags.data.lower()).first()
            if tag:
                news.tag_id = tag.tag_id
            else:
                db.session.add(Tag_category(tag_name=form.tags.data.lower()))
                db.session.commit()
                tag = Tag_category.query.filter_by(tag_name=form.tags.data.lower()).first()
                news.tag_id = tag.tag_id
        if news.file_path and form.upload.data:
            if not replace_news_file(news.file_path, form.upload.data):
                print("Error while uploading documents")
                return render_template("admin/admin_edit_news.html", news=news, form=form, errors="")
        db.session.commit()
        return redirect(url_for("news.news_listing"))
    print(news)
    form.title.data = news.title
    form.content.data = news.content
    form.auto_publish_start_date.data = news.publish_start_date
    form.auto_publish_end_date.data = news.publish_end_date
    form.additional_link.data = news.link
    form.additional_information.data = news.additional_information
    form.news_type.data = news.news_type
    if news.tag_id:
        form.tags.data = news.tag.tag_name
    return render_template("admin/admin_edit_news.html", news=news, form=form, news_nav="active")


@news.route('/news-publish-news/<int:news_id>', methods=['GET', 'POST'])
@login_required
def publish_news(news_id):
    if not current_user.role_id == current_app.config['ADMIN_ID']:
        abort(403)
    news = News_and_Announcements.query.filter_by(news_id=news_id).first()
    print(news)
    news.published_on = datetime.now()
    news.last_updated_on = datetime.now()
    news.published_by = current_user.user_id
    news.is_active = True
    news.last_updated_by = current_user.user_id
    db.session.commit()
    return redirect(url_for("news.news_listing"))

@news.route('/news-unpublish-news/<int:news_id>', methods=['GET', 'POST'])
@login_required
def unpublish_news(news_id):
    if not current_user.role_id == current_app.config['ADMIN_ID']:
        abort(403)
    news = News_and_Announcements.query.filter_by(news_id=news_id).first()
    news.last_updated_on = datetime.now()
    news.is_active = False
    news.last_updated_by = current_user.user_id
    db.session.commit()
    return redirect(url_for("news.news_listing"))

def save_guide_document(fileData, linkedTo):
    folder_path = os.path.join(current_app.root_path, "static/jaltra/documents/guide",linkedTo)
    try:
        if not os.path.exists(folder_path):
            os.mkdir(folder_path)
        random_hex=secrets.token_hex(8)
        _, fn_ext = os.path.splitext(fileData.filename)
        attachment_fn = random_hex + fn_ext
        file_path = os.path.join(current_app.root_path, "static/jaltra/documents/guide/"+linkedTo, attachment_fn)
        fileData.save(file_path)
        attachment_fn = linkedTo+'/'+attachment_fn
        return attachment_fn
    except Exception as e:
        print("exception happended while saving file",e)
        return False

def replace_guide_document(fileData, existing_fn):
    _,f_ext= os.path.splitext(fileData.filename)
    f_name = existing_fn.rsplit(".",1)
    file_path=os.path.join(current_app.root_path,"static/jaltra/documents/guide", existing_fn)
    if os.path.exists(file_path):
        try:
           os.remove(file_path)
           doc_fn =  f_name[0] + f_ext
           doc_path=os.path.join(current_app.root_path,"static/jaltra/documents/guide", doc_fn)
           fileData.save(doc_path)
           return doc_fn
        except Exception as e:
           print("File could not be deleted", e)
           return False
    else:
        print("The file does not exist", file_path)
        return False


@news.route('/guide-new-guide', methods=['GET', 'POST'])
@login_required
def new_guide():
    if not current_user.role_id == current_app.config['ADMIN_ID']:
        abort(403)
    form=NewGuideForm()
    choice1=[('--select--','--select--'),('General','General')]
    choice2 = [(exam.exam_name, exam.exam_name) for exam in Exams.query.filter_by(is_active=True)]
    form.link_to.choices = choice1+choice2
    #setiing choices for guide type
    form.guide_type.choices = [(dic["value"], dic["value"]) for dic in current_app.config['GUIDE_TYPE']]
    if form.validate_on_submit():
        if form.files.data:
            doc_fn = save_guide_document(form.files.data, form.link_to.data)
            if doc_fn:
                db.session.add(Guides(title=form.title.data, content=form.content.data,
                link=form.additional_link.data, additional_information=form.additional_information.data,
                created_by=current_user.user_id, has_file_attached=True, file_path=doc_fn, linked_to_module=form.link_to.data, guide_type=form.guide_type.data,last_updated_by=current_user.user_id, is_active=True))
                db.session.commit()
            else:
                #gives error message and return to approprite page
                return render_template("admin/new_guide.html", news=news, form=form)
        else:
            db.session.add(Guides(title=form.title.data, content=form.content.data,
            link=form.additional_link.data, additional_information=form.additional_information.data,
            created_by=current_user.user_id, linked_to_module=form.link_to.data, last_updated_by=current_user.user_id, guide_type=form.guide_type.data, is_active=True))
            db.session.commit()
        return redirect(url_for('news.guide_listing'))
    #setiing choices for link to
    print('error', form.errors)
    return render_template("admin/new_guide.html", news=news, form=form, guide_nav="active")

@news.route('/guide-edit-guide/<guide_id>', methods=['GET', 'POST'])
@login_required
def edit_guide(guide_id):
    if not current_user.role_id == current_app.config['ADMIN_ID']:
        abort(403)
    form = EditGuideForm()
    #setiing choices for link to
    choice1=[('--select--','--select--'),('General','General')]
    choice2 = [(exam.exam_name, exam.exam_name) for exam in Exams.query.filter_by(is_active=True)]
    form.link_to.choices = choice1+choice2
    #setiing choices for guide type
    form.guide_type.choices = [(dic["value"], dic["value"]) for dic in current_app.config['GUIDE_TYPE']]
    guide = Guides.query.filter_by(guide_id=guide_id).first()
    print("<<form>>", form.data)
    if form.validate_on_submit():
        guide.title = form.title.data
        guide.content = form.content.data
        guide.link = form.additional_link.data
        guide.linked_to_module = form.link_to.data
        guide.additional_information = form.additional_information.data
        guide.guide_type = form.guide_type.data
        if form.files.data:
            if guide.has_file_attached:
                doc_fn = replace_guide_document(form.files.data, guide.file_path)
                guide.file_path = doc_fn
            else:
                doc_fn = save_guide_document(form.files.data, form.link_to.data)
                if doc_fn:
                    guide.has_file_attached = True
                    guide.file_path = doc_fn
                else:
                    #error showed to user
                    return render_template("admin/edit_guide.html", guide=guide, form=form,  guide_nav="active")
        db.session.commit()
        return redirect(url_for("news.guide_listing"))
    print(guide)
    if not form.errors:
        #setting value to edit
        form.guide_id.data = guide.guide_id
        form.title.data = guide.title
        form.content.data = guide.content
        form.additional_link.data = guide.link
        form.link_to.data = guide.linked_to_module
        form.additional_information.data = guide.additional_information
        form.guide_type.data = guide.guide_type
    print("<<form>>", form.data)
    return render_template("admin/edit_guide.html", guide=guide, form=form,  guide_nav="active")

@news.route('/guide-listing', methods=['GET', 'POST'])
@login_required
def guide_listing():
    if not current_user.role_id == current_app.config['ADMIN_ID']:
        abort(403)
    page = request.args.get('page', 1, type=int)
    if request.method=="POST":
        if "search" in request.form and request.form["search"]!="":
            search_value = "%{}%".format(request.form["search"].lower())
            print('<<search value>>',search_value)
            guides = Guides.query.filter(func.lower(Guides.title).contains(search_value)).order_by(Guides.created_on.desc()).all()
            
            return render_template("admin/guide_listing.html", guides=guides, guide_nav="active", search_value=request.form["search"])
        #filter operation
        if "status-active" in request.form:
            guides = Guides.query.filter_by(is_active=True).order_by(Guides.created_on.desc()).all()
            return render_template("admin/guide_listing.html", guides=guides, guide_nav="active", active='checked')
        elif "status-inactive" in request.form:
            guides = Guides.query.filter_by(is_active=False).order_by(Guides.created_on.desc()).all()
            print(guides)
            return render_template("admin/guide_listing.html", guides=guides, guide_nav="active", inactive='checked')
        else:
            guides = Guides.query.order_by(Guides.created_on.desc()).paginate(per_page=10, page=page)
    else:
        guides = Guides.query.order_by(Guides.created_on.desc()).paginate(per_page=10, page=page)     
    print(guides)
    return render_template("admin/guide_listing.html", guides=guides, guide_nav="active")