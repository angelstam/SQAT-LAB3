USE `commissionlab`;
CREATE  OR REPLACE VIEW `commissionlab`.`month_totals` AS
SELECT
    YEAR(date) AS year,
    MONTH(date) AS month,
    DATE_FORMAT(date, '%Y-%m') as yearmonth,
    SUM(locks) AS locks,
    SUM(stocks) AS stocks,
    SUM(barrels) AS barrels
FROM
    orders
GROUP BY
    year,
    month;
