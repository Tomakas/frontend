import Login from "@/components/Login";
import Company from "@/components/Company";
import Devices from "@/components/Devices";
import Overview from "@/components/Overview";
import Items from "@/components/Items";
import StockItems from "@/components/StockItems";
import LostPassword from "@/components/LostPassword";
import NewUser from "@/components/NewUser";
import Users from "@/components/Users";
import Api from "@/components/Api";
import ImportExportItems from "@/components/ImportExportItems";
import Survey from "@/components/Survey";
import Receipts from "@/components/Receipts";
import ReceiptItems from "@/components/ReceiptItems";
import Stock from "@/components/Stock";
import Premium from "@/components/Premium";
import Taxes from "@/components/Taxes";
import Orders from "@/components/Orders";
import Partner from "@/components/Partner";
import Categories from "@/components/Categories";
import StockTakingImportExport from "@/components/StockTakingImportExport";
import RemoteOrderSettings from "@/components/RemoteOrderSettings";
import BehaviourDetection from "@/components/BehaviourDetection";
import ReceiptTemplate from "@/components/ReceiptTemplate";
import LastReceipts from "@/components/LastReceipts.vue";
import User from "@/components/User.vue";
import Suppliers from "@/components/Suppliers.vue";
import ExportSales from "@/components/ExportSales.vue";
import Bills from "@/components/Bills.vue";
import Customers from "@/components/Customers.vue";
import StockMixPreview from "@/components/StockMixPreview.vue";
import EmailLogin from "@/components/EmailLogin.vue";
import CloseCompany from "@/components/CloseCompany.vue";

const routes = [
    { path: '/', component: Overview },
    { path: '/login', component: Login },
    { path: '/company', component: Company },
    { path: '/devices', component: Devices },
    { path: '/overview', component: Overview },
    { path: '/items', component: Items },
    { path: '/stock-items', component: StockItems },
    { path: '/categories', component: Categories },
    { path: '/lostPassword', component: LostPassword},
    { path: '/newUser', component: NewUser},
    { path: '/users', component: Users},
    { path: '/api', component: Api},
    { path: '/import-export', component: ImportExportItems},
    { path: '/receipts', component: Receipts},
    { path: '/receipt-items', component: ReceiptItems},
    { path: '/last-receipts', component: LastReceipts},
    { path: '/survey', component: Survey},
    { path: '/stock', component: Stock},
    { path: '/premium', component: Premium},
    { path: '/taxes', component: Taxes},
    { path: '/orders', component: Orders},
    { path: '/partner', component: Partner},
    { path: '/stocktaking', component: StockTakingImportExport},
    { path: '/remote-order', component: RemoteOrderSettings},
    { path: '/behaviour-detection', component: BehaviourDetection},
    { path: '/receipt-template', component: ReceiptTemplate},
    { path: '/user', component: User},
    { path: '/suppliers', component: Suppliers},
    { path: '/customers', component: Customers},
    { path: '/export-sales', component: ExportSales},
    { path: '/bills', component: Bills},
    { path: '/stockmix-preview', component: StockMixPreview},
    { path: '/emailLogin', component: EmailLogin},
    { path: '/close-company', component: CloseCompany},
    { path: '/sales', component: Overview }, //old link from android app
];

export default routes;