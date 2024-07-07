import requests
import os
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.edge.service import Service
from selenium.webdriver.edge.options import Options
from dotenv import load_dotenv

load_dotenv()

def get_page(url):
    page = requests.get(url)
    soup = BeautifulSoup(page.content, "html.parser")
    return soup

def get_page_selenium(url):
    service = Service(os.getenv('DRIVER_PATH'))
    options = Options()
    browser = webdriver.Edge(service=service, options=options)
    browser.get(url)
    page = browser.page_source
    soup = BeautifulSoup(page, "html.parser")
    browser.quit()
    return soup
