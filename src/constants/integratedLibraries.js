// External Libraries Integrated into the OPAC
import { DEFAULT_COVER } from "@/constants/asset";
import { RESOURCE } from "@/utils/visitResource";

export const INTEGRATED_LIBRARIES = [
    {
        title: "NLP eResources",
        link: "https://eportal.nlp.gov.ph/eresources?fbclid=IwY2xjawN5i3JleHRuA2FlbQIxMABicmlkETFsbzd3b0ZrdTh2MW04dUN5c3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHhALsToBcJ2803E10sJjRRtubjq512MnjhLlwUPS7ik7mQ6tosNVRO-P1mjx_aem_kTm3Wb6ZKg7jI1eIFw9DlQ",
        thumbnail: DEFAULT_COVER,
        resourceAddress: RESOURCE.NLP_RESOURCE,
    },
    {
        title: "DOST - STARTBOOKS eResource",
        link: null,
        thumbnail: DEFAULT_COVER,
        resourceAddress: RESOURCE.DOST_RESOURCE,
    }
];