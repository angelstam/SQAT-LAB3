USE `commissionlab`;
CREATE  OR REPLACE VIEW `commissionlab`.`completed_month_totals` AS
SELECT
    YEAR(date) AS year,
    MONTH(date) AS month,
    SUM(locks) AS locks,
    SUM(stocks) AS stocks,
    SUM(barrels) AS barrels
FROM
    completed_months
    LEFT JOIN orders ON YEAR(orders.date) = year AND MONTH(orders.date) = month
GROUP BY
    year,
    month;
