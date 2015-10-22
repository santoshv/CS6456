from flask import Blueprint, request, render_template, redirect, url_for
import pymysql

mod_data = Blueprint('mod_data', __name__, url_prefix = '/data')

conn = pymysql.connect(host='localhost', port=3306, user='root', passwd='', db='gestviz')
cur = conn.cursor()

@mod_data.route('/index1.html')
def index1():
	return render_template('/mod_data/index1.html')

@mod_data.route('/topic1')
def topic_mod1():
	##For creating a new topic
	# word = request.args.get('word', '')
	# topic = request.args.get('topic', '')
	# cat = request.args.get('category', '')
	cur.execute("delete from topic_words where topic = '"+topic+"' and category = '"+cat+"' and word is null")
	cur.execute("INSERT INTO topic_words (category, topic, word, weight) VALUES ('"+cat+"', '"+topic+"','"+word+"', 0) ON DUPLICATE KEY UPDATE  weight=VALUES(weight)")
	return "hello";
