from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, TextAreaField, SelectField
from wtforms.validators import DataRequired, ValidationError, Optional
from wtforms.fields.html5 import DateField
from flask_wtf.file import FileField, FileAllowed
from datetime import datetime

from app.utils.models import Status_lookup
from app.newsandannouncements.models import Guides

class NewsPostForm(FlaskForm):
    news_type = SelectField('News type',choices=[('--select--','--select--'),('Flash','Flash'),('Normal','Normal'),('Website content', 'Website content')])
    title = StringField('Title')
    content = TextAreaField('Content')
    auto_publish_start_date = DateField('Auto Publish Start Date', validators=[Optional()])
    auto_publish_end_date = DateField('Auto Publish End Date', validators=[Optional()])
    upload = FileField()
    additional_link = StringField('Additional Link')
    tags = StringField('Tags')
    additional_information = TextAreaField('Additional Information')
    submit = SubmitField('Submit')
    cancel = SubmitField('Cancel')

    def validate_title(form, field):
        status = Status_lookup.query.filter(Status_lookup.status_name==field.data, Status_lookup.is_active==True).first()
        if status:
            raise ValidationError('Entered news title already exist')

class EditNewsForm(FlaskForm):
    news_type = SelectField('News type',choices=[('--select--','--select--'),('Flash','Flash'),('Normal','Normal'),('Website content', 'Website content')])
    title = StringField('Title')
    content = TextAreaField('Content')
    auto_publish_start_date = DateField('Auto Publish Start Date', validators=[Optional()])
    auto_publish_end_date = DateField('Auto Publish End Date', validators=[Optional()])
    upload = FileField('Image')
    additional_link = StringField('Additional Link')
    tags = StringField('Tags')
    additional_information = TextAreaField('Additional Information')
    update = SubmitField('update')
    publish_news = SubmitField('Publish News')

class NewGuideForm(FlaskForm):
    link_to = SelectField('Link to', coerce=str)
    guide_type = SelectField('Guide type', coerce=str)
    title = StringField('Guide Title')
    content = TextAreaField('Guide Content')
    files = FileField()
    additional_link = StringField('Additional Link')
    additional_information = TextAreaField('Additional Information')
    submit = SubmitField('Submit')

    def validate_guide_type(form, field):
        if field.data=="Before apply":
            print("form ,field", form.data)
            guide = Guides.query.filter(Guides.linked_to_module==form.link_to.data, Guides.guide_type==field.data, Guides.is_active==True).first()
            if guide:
                 raise ValidationError('Instruction before exam for this exam is already defined')
        elif field.data=="After apply":
            guide = Guides.query.filter(Guides.linked_to_module==form.link_to.data, Guides.guide_type==field.data, Guides.is_active==True).first()
            if guide:
                 raise ValidationError('Instruction after exam for this exam is already defined')

class EditGuideForm(FlaskForm):
    guide_id = StringField('Guide id')
    link_to = SelectField('Link to', coerce=str)
    guide_type = SelectField('Guide type', coerce=str)
    title = StringField('Guide Title')
    content = TextAreaField('Guide Content')
    files = FileField()
    additional_link = StringField('Additional Link')
    additional_information = TextAreaField('Additional Information')
    submit = SubmitField('update')

    def validate_guide_type(form, field):
        if field.data=="Before apply":
            print("form ,field", form.data)
            guide = Guides.query.filter(Guides.linked_to_module==form.link_to.data, Guides.guide_type==field.data, Guides.is_active==True, Guides.guide_id!=int(form.guide_id.data)).first()
            if guide:
                 raise ValidationError('Instruction before exam for this exam is already defined')
        elif field.data=="After apply":
            print("form ,field", form.data)
            guide = Guides.query.filter(Guides.linked_to_module==form.link_to.data, Guides.guide_type==field.data, Guides.is_active==True, Guides.guide_id!=int(form.guide_id.data)).first()
            if guide:
                 raise ValidationError('Instruction after exam for this exam is already defined')
