USE `commissionlab`;
CREATE  OR REPLACE VIEW `commissionlab`.`open_month_totals` AS
SELECT
    yearmonth AS month,
    locks,
    stocks,
    barrels
FROM
    month_totals mt
WHERE
    NOT EXISTS (SELECT year, month 
                  FROM completed_months cm
                  WHERE mt.year = cm.year AND mt.month = cm.month)
