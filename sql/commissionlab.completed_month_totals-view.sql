USE `commissionlab`;
CREATE  OR REPLACE VIEW `commissionlab`.`completed_month_totals` AS
SELECT
    completed_months.year,
    completed_months.month,
    month_totals.yearmonth,
    locks,
    stocks,
    barrels
FROM
    completed_months
    LEFT JOIN month_totals ON completed_months.year = month_totals.year AND completed_months.month = month_totals.month
GROUP BY
    completed_months.year,
    completed_months.month;
