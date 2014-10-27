from flask import Blueprint, render_template

mod_data = Blueprint('mod_data', __name__, url_prefix = '/data')


@mod_data.route('/')
def index():
	return "Hello world"