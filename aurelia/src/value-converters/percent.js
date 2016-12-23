import numeral from 'numeral';

// A ValueConverter to show 2 digit percentage
export class PercentValueConverter {
    toView(number) {
        return numeral(number).format('0.00%');
    }
}