from flask import Blueprint, request, render_template, redirect, url_for
import pymysql
# import psycopg2
import simplejson

mod_data = Blueprint('mod_data', __name__, url_prefix = '/data')

conn = pymysql.connect(host='localhost', port=3306, user='root', passwd='', db='gestviz')
#conn=psycopg2.connect("dbname='gestviz' user='aishwaryarajagopal' password=''")
cur = conn.cursor()

@mod_data.route('/index1.html')
def index1():
	return render_template('/mod_data/index1.html')

@mod_data.route('/retrieve_schema_list')
def retrieve_schema_list():
	#For the main.html screen
	cur.execute("select db_id, db_name, db_desc from schema_master order by db_id")
	result_str = []
	for row in cur:
		result_str.append(row);
	return simplejson.dumps(result_str);

@mod_data.route('/get_filter_fields')
def get_filter_fields():
	#For filter.html screen
	dbid = request.args.get('dbid', '')
	cur.execute("SELECT field_name FROM gestviz_fields where db_id = "+dbid+" and filter_flag = 1")
	result_str = []
	for row in cur:
		result_str.append(row[0]);
	return simplejson.dumps(result_str);

@mod_data.route('/get_scale_fields')
def get_scale_fields():
	#For selectscale.html screen
	dbid = request.args.get('dbid', '')
	cur.execute("SELECT field_name FROM gestviz_fields where db_id = "+dbid+" and scale_flag = 1")
	result_str = []
	for row in cur:
		result_str.append(row[0]);
	return simplejson.dumps(result_str);

@mod_data.route('/get_scatterplot_points')
def get_scatterplot_points():
	#For index.html screen
	#http://0.0.0.0:5000/data/get_scatterplot_points?dbid=2&fname=category&ftype=2&filters=1*profit*1*10,2*category*Coffee
	#http://0.0.0.0:5000/data/get_scatterplot_points?dbid=2&fname=profit&ftype=1&filters=1*profit*1*10,2*category*Coffee
	dbid = request.args.get('dbid', '')
	field_name = request.args.get('fname', '')
	field_type = request.args.get('ftype', '')
	filter_fields = request.args.get('filters', '') #sample input : 1*profit*1*10,2*category*Coffee

	filter_array = filter_fields.split(",");
	
	cur.execute("drop table if exists temptab");
	cur.execute("create table temptab as SELECT * FROM gestviz_data where db_id = "+dbid);
	cur.execute("select distinct rec_id FROM temptab");
	rec_ids = []
	for row in cur:
		rec_ids.append(row[0]);

	for rec in filter_array:
		rec_val_arr = rec.split("*")
		ff_name = rec_val_arr[1]
		b = rec_ids
		if rec_val_arr[0] == "1":
			ff_min = rec_val_arr[2]
			ff_max = rec_val_arr[3]
			cur.execute("select distinct rec_id FROM temptab where field_name = '"+ff_name+"' and value between "+ff_min+" and "+ff_max);
			a = []
			for row in cur:
				a.append(row[0])
		else:
			ff_val = rec_val_arr[2]
			cur.execute("select distinct rec_id FROM temptab where field_name = '"+ff_name+"' and value = '"+ff_val+"'");
			a = []
			for row in cur:
				a.append(row[0])
		rec_ids = list(set(a) & set(b))

	#For all rec_ids, get the field value
	rec_id_str = ','.join(str(x) for x in rec_ids)
	print rec_id_str;
	cur.execute("drop table if exists temptab2");
	cur.execute("create table temptab2 as SELECT * FROM temptab where rec_id in ("+rec_id_str+") order by value");

	result_str = []
	cur1 = conn.cursor()
	if field_type == '1':
		rec = cur.execute("select min(value) as minval, max(value) as maxval FROM temptab2 where field_name = '"+field_name+"'");
		minval = 0
		maxval = 0
		for rec in cur:
			minval  = int(rec[0])
			maxval = int(rec[1])
			break;
		val_range = (maxval - minval)/5
		start_val = minval
		print val_range
		while (start_val <= maxval):
			record = {}
			recs = []
			record["cluster"] = str(start_val) + "-"+ str(start_val+val_range)
			cur1.execute("select * FROM temptab2 where field_name = '"+field_name+"' and value between "+str(start_val)+" and "+str(start_val+val_range) );
			start_val = start_val+val_range+1
			for rec_id in cur1:
				recs.append(rec_id[1])
			record["recs"] = recs
			result_str.append(record)

	else:
		cur.execute("select distinct value FROM temptab2 where field_name = '"+field_name+"'");
		for rec in cur:
			record = {}
			record["cluster"] = rec[0];
			recs = []
			cur1.execute("select * FROM temptab2 where field_name = '"+field_name+"' and value = '"+rec[0]+"'");
			for rec_id in cur1:
				recs.append(rec_id[1])
			record["recs"] = recs
			result_str.append(record)
	return simplejson.dumps(result_str);