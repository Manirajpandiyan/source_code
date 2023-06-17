from app import db
from datetime import datetime

class News_and_Announcements(db.Model):
    __tablename__= 'news_and_announcements'
    news_id = db.Column(db.Integer, primary_key = True)
    title  = db.Column(db.String(255), nullable=False)
    content = db.Column(db.String)
    publish_start_date = db.Column(db.DateTime)
    publish_end_date = db.Column(db.DateTime)
    published_on = db.Column(db.DateTime)
    published_by = db.Column(db.Integer)
    link = db.Column(db.String(255))
    is_active = db.Column(db.Boolean, default=False)
    created_on = db.Column(db.DateTime, default=datetime.now())
    created_by = db.Column(db.Integer, nullable=False)
    last_updated_on = db.Column(db.DateTime, default=datetime.now())
    last_updated_by = db.Column(db.Integer)
    file_path = db.Column(db.String(225))
    additional_information = db.Column(db.String(255))
    news_type = db.Column(db.String)
    # tag_id = db.relationship('tag_category', backref='news', lazy=True)
    # status_lookup_id
    tag_id = db.Column(db.Integer, db.ForeignKey('tag_category.tag_id'))
    status_lookup_id = db.Column(db.Integer, db.ForeignKey("status_lookup.status_id"))



class Tag_category(db.Model):
    __tablename__= 'tag_category'
    tag_id = db.Column(db.Integer, primary_key=True)
    tag_name = db.Column(db.String(255), nullable = False)
    tag_description = db.Column(db.String(255))
    news =  db.relationship('News_and_Announcements', backref='tag', lazy=True)


class Guides(db.Model):
    __tablename__= 'guides'
    guide_id =  db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.String)
    link = db.Column(db.String(255))
    linked_to_module = db.Column(db.String(255))
    has_file_attached = db.Column(db.Boolean, default=False)
    file_path = db.Column(db.String(225))
    is_active = db.Column(db.Boolean, default=False)
    created_on = db.Column(db.DateTime, default=datetime.now(), nullable=False)
    last_updated_on = db.Column(db.DateTime, default=datetime.now())
    last_updated_by = db.Column(db.Integer, nullable = False)
    additional_information = db.Column(db.String(255))
    guide_type = db.Column(db.String(255))
    # news =  db.relationship('news_and_announcements', backref='guide', lazy=True)
    status_lookup_id = db.Column(db.Integer, db.ForeignKey("status_lookup.status_id"))
    created_by = db.Column(db.Integer, db.ForeignKey("users.user_id"))