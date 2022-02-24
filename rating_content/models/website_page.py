# -*- coding: utf-8 -*-

from odoo import models, fields, api


class WebsitePage(models.Model):
    _inherit = 'website.page'

    AVAILABLE_RATINGS = [
        ('0', "Can't decide"),
        ('1', 'Very Dissatisfied'),
        ('2', 'Dissatisfied'),
        ('3', 'Fair'),
        ('4', 'Satisfied'),
        ('5', 'Very Satisfied'),
    ]

    rating_count = fields.Integer(string='Rating Count', default=0, readonly=True)
    rating_percentage = fields.Float(string='Rating Percentage', compute='compute_rating_percentage', readonly=True)
    rating = fields.Selection(AVAILABLE_RATINGS, string='Rating', compute='compute_rating', readonly=True)
    rating_sum = fields.Float(string='Rating Sum', default=0, readonly=True)

    def compute_rating_percentage(self):
        for record in self:
            if record.rating_count > 0:
                record.rating_percentage = (record.rating_sum / (record.rating_count * 5)) * 100
            else:
                record.rating_percentage = 0

    def compute_rating(self):
        for record in self:
            if record.rating_count > 0:
                calculation_percentage = (record.rating_sum / (record.rating_count * 5)) * 100
                if calculation_percentage == 0:
                    record.rating = '0'
                elif 0 < calculation_percentage <= 20:
                    record.rating = '1'
                elif 20 < calculation_percentage <= 40:
                    record.rating = '2'
                elif 40 < calculation_percentage <= 60:
                    record.rating = '3'
                elif 60 < calculation_percentage <= 80:
                    record.rating = '4'
                elif 80 < calculation_percentage <= 100:
                    record.rating = '5'
            else:
                record.rating = '0'
