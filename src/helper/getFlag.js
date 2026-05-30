export function getFlagByNationality(flags, nationality, country) {
    if (nationality != "") {

        if (nationality === "British") {
            return "GB";
        } else if (nationality === "German") {
            return "DE";
        } else if (nationality === "Dutch") {
            return "NL";
        }
        const flag = flags.find((flag) => flag.nationality === nationality);
        return flag?.alpha_2_code;
    }
    else //by country
    {
        if (country === "UK") {
            return "GB";
        } else if (country === "Germany") {
            return "DE";
        } else if (country === "Netherlands") {
            return "NL";
        }

        const flag = flags.find((flag) => flag.en_short_name === country);
        return flag?.alpha_2_code;
    }
}

