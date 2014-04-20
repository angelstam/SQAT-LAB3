FLAGS = -interaction=batchmode --shell-escape
NUMBERS = 1 2 3
TEXER = xelatex

main: report

clean: cleantemp cleanpdf

cleantemp:
	rm -f *.aux *.log *.synctex.gz *.bib

cleanpdf:
	rm -f report-*.pdf

report:	
	$(foreach var,$(NUMBERS),$(TEXER) $(FLAGS) report-protractor.tex;)