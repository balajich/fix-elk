import logging

from flask import Flask
from pythonjsonlogger import jsonlogger

app = Flask(__name__)

# Configure text logging
text_log_handler = logging.FileHandler('logs/python-app.log')
text_formatter = logging.Formatter('%(asctime)s %(levelname)s [%(threadName)s] [%(name)s] %(message)s',
                                   datefmt='%Y-%m-%dT%H:%M:%S')
text_log_handler.setFormatter(text_formatter)

# Configure JSON logging
json_log_handler = logging.FileHandler('logs/python-app-log.json')
json_formatter = jsonlogger.JsonFormatter('%(asctime)s %(levelname)s [%(threadName)s] [%(name)s] %(message)s',
                                          datefmt='%Y-%m-%dT%H:%M:%S',
                                          rename_fields={'asctime': 'timestamp', 'levelname': 'level',
                                                         'threadName': 'thread', 'name': 'logger'})
json_log_handler.setFormatter(json_formatter)

# Set up the logger
logger = logging.getLogger()
logger.addHandler(text_log_handler)
logger.addHandler(json_log_handler)
logger.setLevel(logging.INFO)
# Add custom field
extra = {'service': 'python-app'}


@app.route('/hello')
def hello():
    logger.info('User logged in', extra=extra)
    return 'Hello World'


if __name__ == '__main__':
    app.run(debug=True)
