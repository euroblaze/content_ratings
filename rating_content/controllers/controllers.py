# -*- coding: utf-8 -*-

from odoo import http
from odoo.http import request


class RatingPage(http.Controller):

    @http.route('/get_current_page_rating/', auth='public', type='json')
    def get_current_page(self, **kw):
        rating = None
        rated_pages = kw['rated_pages']
        website = request.env['website'].get_current_website()
        domain = request.httprequest.headers.environ.get("HTTP_ORIGIN")
        url = request.httprequest.headers.environ.get("HTTP_REFERER")
        url = url.replace(domain, '')
        if url.endswith('/') and len(url) > 1:
            url = url[:-1]
        page = request.env['website.page'].sudo().search([('url', '=', url), ('website_id', '=', website.id)], limit=1)
        if page:
            page_id = str(page.id)
            if page_id in rated_pages:
                rating = rated_pages[page_id]
        return rating

    @http.route('/rating_page/', auth='public', type='json')
    def rating_page(self, **kw):
        rated_pages = kw['rated_pages']
        website = request.env['website'].get_current_website()
        domain = request.httprequest.headers.environ.get("HTTP_ORIGIN")
        rating = kw['rating']
        url = request.httprequest.headers.environ.get("HTTP_REFERER")
        url = url.replace(domain, '')
        if url.endswith('/') and len(url) > 1:
            url = url[:-1]
        page = request.env['website.page'].sudo().search([('url', '=', url), ('website_id', '=', website.id)], limit=1)
        if page:
            page_id = str(page.id)
            if page_id in rated_pages:
                previous_rating = rated_pages[page_id]
                rated_pages[page_id] = rating
                page.sudo().write({'rating_sum': page.rating_sum + (rating - previous_rating)})
            else:
                rated_pages[page_id] = rating
                page.sudo().write({'rating_count': page.rating_count + 1, 'rating_sum': page.rating_sum + rating})
        return [rated_pages, rating]
