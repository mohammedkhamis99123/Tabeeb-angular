import { TranslateService } from "@ngx-translate/core"

export class Utilities{
    /**
     *
     */
    constructor(private translate:TranslateService) {
            
    }
     requiredLabel="*"

     get paginationInfo() {
        return this.translate.currentLang == 'ae' ? 'عرض {0} إلى {1} من {2} عنصر' : 'Showing {0} to {1} of {2} entries'
    }

    get NoDataContent() {
        return this.translate.currentLang == 'ae' ? "لا توجد  بيانات  متاحة" : "No Data Available"
    }

}