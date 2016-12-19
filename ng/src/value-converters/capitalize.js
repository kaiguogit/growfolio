export class CapitalizeValueConverter {
    toView(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}