import * as cheerio from 'cheerio';

export function parseCurrencyRates(html: string) {

  const $ = cheerio.load(html);
  const rates: any = [];

  $('table.table-best tr').each((index, element) => {
    if (index === 0) return;

    const cols = $(element).find('td');
    if (cols.length >= 4) {
      const currencyLink = $(cols[0]).find('a').attr('href');
      const code = currencyLink ? currencyLink.split('/').pop()?.toUpperCase() : '';

      const buy = parseFloat($(cols[1]).text().trim());
      const sell = parseFloat($(cols[2]).text().trim());
      const centralBankRate = parseFloat($(cols[3]).text().trim());

      if (code && !isNaN(buy) && !isNaN(sell)) {
        rates.push({
          code: code || 'UNKNOWN',
          name: $(cols[0]).find('a').text().trim(),
          buy,
          sell,
          centralBankRate,
        });
      }
    }
  });

  return rates;
}