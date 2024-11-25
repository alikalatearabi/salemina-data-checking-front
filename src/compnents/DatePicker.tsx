import { ConfigProvider } from "antd";
import { DatePicker as DatePickerJalali, JalaliLocaleListener } from "antd-jalali";

import fa_IR from "antd/lib/locale/fa_IR";
import { Dayjs } from "dayjs";


const PersianDatePicker: React.FC = () => {

    const RangePickerChange = (dates: [Dayjs | null, Dayjs | null]) => {
        console.log('Selected Dates:', dates[0]?.toISOString());
        console.log('Formatted Dates:', dates);
    }


    return <ConfigProvider
        locale={fa_IR}
        direction="rtl"
        theme={DatePickerTheme}
    >
        <JalaliLocaleListener />
        <DatePickerJalali.RangePicker
            style={{ width: '100%' }}
            allowEmpty
            showTime
            onChange={RangePickerChange}
        />
    </ConfigProvider>
}

const DatePickerTheme = {
    token: {
        borderRadius: 10,
    },
    components: {
        DatePicker: {
        },
    },
}



export default PersianDatePicker;