import { EAct, PermissionsEnum } from "./permission.enum";
import { permissionSections } from "./permission.sections";

export interface IPermissionItem {
  section: string;
  name: string;
  actions: { action: EAct; name: string; description: string }[];
}

export type IPermissionDto = {
  [key in PermissionsEnum]?: EAct[];
};

type IPermissions = { [key in PermissionsEnum]: IPermissionItem };

/* for additional information
  @see:  https://jerainfopulse.atlassian.net/wiki/spaces/JD/pages/561446917/Functional+Permissions+v2+draft
*/
export const PERMISSION_DETAIL: IPermissions = {
  [PermissionsEnum.admin_permission]: {
    section: permissionSections.systems,
    name: "Admin permission",
    actions: [
      {
        action: EAct.ALL,
        name: "All (all actions allowed)",
        description: "Give all permission",
      },
    ],
  },
  list_of_not_confirmed_alarms: {
    section: permissionSections.alarms,
    name: "Access to the List of Not Confirmed Alarms",
    actions: [
      {
        action: EAct.VIEW,
        name: "View the list of not confirmed alarms",
        description: "User can see the item in the navigation sidebar and open the list (by click or direct link)",
      },
      {
        action: EAct.ALL,
        name: "All actions allowed",
        description: "User has all actions listed above in the permission",
      },
    ],
  },
  list_of_confirmed_alarms: {
    section: permissionSections.alarms,
    name: "Access to the List of Confirmed Alarms",
    actions: [
      {
        action: EAct.VIEW,
        name: "View the list of confirmed alarms",
        description: "User can see the item in the navigation sidebar and open the list (by click or direct link)",
      },
      {
        action: EAct.ALL,
        name: "All actions allowed",
        description: "User has all actions listed above in the permission",
      },
    ],
  },
  not_confirmed_alarm: {
    section: permissionSections.alarms,
    name: "Not Confirmed Alarm",
    actions: [
      {
        action: EAct.READ,
        name: "Open alarm page",
        description:
          "User can click on an item in the table AND open the page of Not Confirmed Alarm AND see attachments",
      },
      {
        action: EAct.UPDATE,
        name: "Edit alarm",
        description: "Use can edit not confirmed alarm on individual alarm page",
      },
      {
        action: EAct.DOWNLOAD,
        name: "Download attachments",
        description: "User can download attachments",
      },
      {
        action: EAct.UPLOAD,
        name: "Upload/Remove attachments",
        description: "User can upload and remove attachments",
      },
      {
        action: EAct.ACTION0,
        name: "Confirm alarm",
        description: "User can confirm alarm (on both individual alarm page and alarms list page)",
      },
      {
        action: EAct.ACTION7,
        name: "Receive notification",
        description: "User can receive the notification about a new alarm",
      },
      {
        action: EAct.ALL,
        name: "All actions allowed",
        description: "User has all actions listed above in the permission",
      },
    ],
  },
  confirmed_alarm: {
    section: permissionSections.alarms,
    name: "Confirmed Alarm",
    actions: [
      {
        action: EAct.CREATE,
        name: "Create alarm manually",
        description: "User can create an alarm manually (by the button on the list page)",
      },
      {
        action: EAct.READ,
        name: "Open alarm page",
        description: "User can click on an item in the table AND open the page of Confirmed Alarm AND see attachments",
      },
      {
        action: EAct.UPDATE,
        name: "Edit alarm",
        description: "Use can edit confirmed alarm on both individual alarm page and alarms list page",
      },
      {
        action: EAct.DELETE,
        name: "Remove alarm",
        description: "User can remove confirmed alarm on the alarms list page",
      },
      {
        action: EAct.DOWNLOAD,
        name: "Download attachments",
        description: "User can download attachments",
      },
      {
        action: EAct.UPLOAD,
        name: "Upload/Remove attachments",
        description: "User can upload and remove attachments",
      },
      {
        action: EAct.ACTION7,
        name: "Receive notification",
        description: "User can receive the notification when an alarm become confirmed",
      },
      {
        action: EAct.ALL,
        name: "All actions allowed",
        description: "User has all actions listed above in the permission",
      },
    ],
  },
  list_of_reports_in_work: {
    section: permissionSections.reports,
    name: "Access to the List of Reports In Work",
    actions: [
      {
        action: EAct.VIEW,
        name: "View the list of reports in work",
        description: "User can see the item in the navigation sidebar and open the list (by click or direct link)",
      },
      {
        action: EAct.ALL,
        name: "All actions allowed",
        description: "User has all actions listed above in the permission",
      },
    ],
  },

  list_of_completed_reports: {
    section: permissionSections.reports,
    name: "Access to the List of Completed Reports",
    actions: [
      {
        action: EAct.VIEW,
        name: "View the list of completed reports",
        description: "User can see the item in the navigation sidebar and open the list (by click or direct link)",
      },
      {
        action: EAct.ALL,
        name: "All actions allowed",
        description: "User has all actions listed above in the permission",
      },
    ],
  },
  report_draft: {
    section: permissionSections.reports,
    name: "Report Draft",
    actions: [
      {
        action: EAct.VIEW,
        name: "View draft reports in the list",
        description: "User can see reports with the status Draft as item in the table",
      },
      {
        action: EAct.CREATE,
        name: "Create a new report based on the confirmed alarm",
        description:
          "User can create a new report by the toggle during alarm confirmation and on the alarm edit pop-up. The toggle is disabled if this action is not granted",
      },
      {
        action: EAct.READ,
        name: "Open report page",
        description:
          "User can click on an item in the table AND open the page of Draft Report (all tabs available) AND see attachments",
      },
      {
        action: EAct.UPDATE,
        name: "Edit report",
        description: "Edit report details (all tabs) except customer feedback",
      },
      {
        action: EAct.DELETE,
        name: "Close report",
        description: "User can close report by the button in the header",
      },
      {
        action: EAct.DOWNLOAD,
        name: "Download attachments",
        description: "User can download attachments",
      },
      {
        action: EAct.UPLOAD,
        name: "Upload/Remove attachments",
        description: "User can upload and remove attachments",
      },
      {
        action: EAct.ACTION0,
        name: "Send to approve",
        description: "User can send report to approve (change status to Pending Approval)",
      },
      {
        action: EAct.ACTION3,
        name: "View as Customer",
        description:
          "User can click on an item in the table AND open the page of Draft Report (preview tab ONLY) AND see attachments",
      },
      {
        action: EAct.ACTION4,
        name: "Edit as Customer",
        description:
          "User can edit customer feedback (add/edit/remove answers) on the Preview tab of the report in the status Draft",
      },
      {
        action: EAct.ACTION7,
        name: "Receive notification",
        description:
          "User can receive the notification when a report status is changed to “Draft” (initial report status does not matter) AND when a report is deleted",
      },
      {
        action: EAct.ALL,
        name: "All actions allowed",
        description: "User has all actions listed above in the permission",
      },
    ],
  },
  report_pending_approval: {
    section: permissionSections.reports,
    name: "Report Pending Approval",
    actions: [
      {
        action: EAct.VIEW,
        name: "View pending approval reports in the list",
        description: "User can see reports with the status Pending Approval as item in the table",
      },
      {
        action: EAct.READ,
        name: "Open report page",
        description:
          "User can click on an item in the table AND open the page of Pending Approval Report (all tabs available) AND see attachments",
      },
      {
        action: EAct.UPDATE,
        name: "Edit report",
        description: "Edit report details (all tabs) except customer feedback",
      },
      {
        action: EAct.DOWNLOAD,
        name: "Download attachments",
        description: "User can download attachments",
      },
      {
        action: EAct.UPLOAD,
        name: "Upload/Remove attachments",
        description: "User can upload and remove attachments",
      },
      {
        action: EAct.ACTION0,
        name: "Approve Report",
        description: "User can approve report (change status to Approved)",
      },
      {
        action: EAct.ACTION1,
        name: "Decline Report",
        description: "User can decline report (change status to Draft)",
      },
      {
        action: EAct.ACTION3,
        name: "View as Customer",
        description:
          "User can click on an item in the table AND open the page of Pending Approval Report (preview tab ONLY) AND see attachments",
      },
      {
        action: EAct.ACTION4,
        name: "Edit as Customer",
        description:
          "User can edit customer feedback (add/edit/remove answers) on the Preview tab of the report in the status Pending Approval",
      },
      {
        action: EAct.ACTION7,
        name: "Receive notification",
        description:
          "User can receive the notification when a report status is changed to “Pending Approval” (initial report status does not matter)",
      },
      {
        action: EAct.ALL,
        name: "All actions allowed",
        description: "User has all actions listed above in the permission",
      },
    ],
  },
  report_approved: {
    section: permissionSections.reports,
    name: "Report Approved",
    actions: [
      {
        action: EAct.VIEW,
        name: "View approved reports in the list",
        description: "User can see reports with the status Approved as item in the table",
      },
      {
        action: EAct.READ,
        name: "Open report page",
        description:
          "User can click on an item in the table AND open the page of Approved Report (all tabs available) AND see attachments",
      },
      {
        action: EAct.UPDATE,
        name: "Edit report",
        description: "Edit report details (all tabs) except customer feedback",
      },
      {
        action: EAct.DOWNLOAD,
        name: "Download attachments",
        description: "User can download attachments",
      },
      {
        action: EAct.UPLOAD,
        name: "Upload/Remove attachments",
        description: "User can upload and remove attachments",
      },
      {
        action: EAct.ACTION0,
        name: "Send to Customer",
        description: "User can send report to Customer (change status to Waiting Response)",
      },
      {
        action: EAct.ACTION1,
        name: "Decline report approval",
        description: "User can decline report approval (change status to Pending Approval or Draft)",
      },
      {
        action: EAct.ACTION3,
        name: "View as Customer",
        description:
          "User can click on an item in the table AND open the page of Approved Report (preview tab ONLY) AND see attachments",
      },
      {
        action: EAct.ACTION4,
        name: "Edit as Customer",
        description:
          "User can edit customer feedback (add/edit/remove answers) on the Preview tab of the report in the status Approved",
      },
      {
        action: EAct.ACTION7,
        name: "Receive notification",
        description:
          "User can receive the notification when a report status is changed to “Approved” (initial report status does not matter)",
      },
      {
        action: EAct.ALL,
        name: "All actions allowed",
        description: "User has all actions listed above in the permission",
      },
    ],
  },
  report_waiting_response: {
    section: permissionSections.reports,
    name: "Report Waiting Response",
    actions: [
      {
        action: EAct.VIEW,
        name: "View waiting response reports in the list",
        description: "User can see reports with the status Waiting Response as item in the table",
      },
      {
        action: EAct.READ,
        name: "Open report page",
        description:
          "User can click on an item in the table AND open the page of Waiting Response Report (all tabs available) AND see attachments",
      },
      {
        action: EAct.UPDATE,
        name: "Edit report",
        description: "Edit report details (all tabs) except customer feedback",
      },
      {
        action: EAct.DOWNLOAD,
        name: "Download attachments",
        description: "User can download attachments",
      },
      {
        action: EAct.UPLOAD,
        name: "Upload/Remove attachments",
        description: "User can upload and remove attachments",
      },
      {
        action: EAct.ACTION0,
        name: "Give Customer feedback",
        description: "User can give customer feedback (change status to Responded)",
      },
      {
        action: EAct.ACTION3,
        name: "View as Customer",
        description:
          "User can click on an item in the table AND open the page of Waiting Response Report (preview tab ONLY) AND see attachments",
      },
      {
        action: EAct.ACTION4,
        name: "Edit as Customer",
        description:
          "User can edit customer feedback (add/edit/remove answers) on the Preview tab of the report in the status Waiting Response",
      },
      {
        action: EAct.ACTION7,
        name: "Receive notification",
        description:
          "User can receive the notification when a report status is changed to “Waiting Response” (initial report status does not matter)",
      },
      {
        action: EAct.ALL,
        name: "All actions allowed",
        description: "User has all actions listed above in the permission",
      },
    ],
  },
  report_responded: {
    section: permissionSections.reports,
    name: "Report Responded",
    actions: [
      {
        action: EAct.VIEW,
        name: "View waiting response reports in the list",
        description: "User can see reports with the status Responded as item in the table",
      },
      {
        action: EAct.READ,
        name: "Open report page",
        description:
          "User can click on an item in the table AND open the page of Responded Report (all tabs available) AND see attachments",
      },
      {
        action: EAct.UPDATE,
        name: "Edit report",
        description: "Edit report details (all tabs) except customer feedback",
      },
      {
        action: EAct.DOWNLOAD,
        name: "Download attachments",
        description: "User can download attachments",
      },
      {
        action: EAct.UPLOAD,
        name: "Upload/Remove attachments",
        description: "User can upload and remove attachments",
      },
      {
        action: EAct.ACTION0,
        name: "Complete report",
        description: "User can complete report (change status to Completed)",
      },
      {
        action: EAct.ACTION2,
        name: "Rework Report",
        description: "User can send report to be reworked (change status to Draft)",
      },
      {
        action: EAct.ACTION3,
        name: "View as Customer",
        description:
          "User can click on an item in the table AND open the page of Responded Report (preview tab ONLY) AND see attachments",
      },
      {
        action: EAct.ACTION4,
        name: "Edit as Customer",
        description:
          "User can edit customer feedback (add/edit/remove answers) on the Preview tab of the report in the status Responded",
      },
      {
        action: EAct.ACTION7,
        name: "Receive notification",
        description:
          "User can receive the notification when a report status is changed to “Responded” (initial report status does not matter)",
      },
      {
        action: EAct.ALL,
        name: "All actions allowed",
        description: "User has all actions listed above in the permission",
      },
    ],
  },
  report_completed: {
    section: permissionSections.reports,
    name: "Report Completed",
    actions: [
      {
        action: EAct.VIEW,
        name: "View completed reports in the list",
        description: "User can see reports with the status Completed as item in the table",
      },
      {
        action: EAct.READ,
        name: "Open report page",
        description:
          "User can click on an item in the table AND open the page of Completed Report (all tabs available) AND see attachments",
      },
      {
        action: EAct.UPDATE,
        name: "Edit report",
        description: "Edit report details (all tabs) except customer feedback",
      },
      {
        action: EAct.DOWNLOAD,
        name: "Download attachments",
        description: "User can download attachments",
      },
      {
        action: EAct.UPLOAD,
        name: "Upload/Remove attachments",
        description: "User can upload and remove attachments",
      },
      {
        action: EAct.ACTION3,
        name: "View as Customer",
        description:
          "User can click on an item in the table AND open the page of Responded Report (preview tab ONLY) AND see attachments",
      },
      {
        action: EAct.ACTION4,
        name: "Edit as Customer",
        description:
          "User can edit customer feedback (add/edit/remove answers) on the Preview tab of the report in the status Responded",
      },
      {
        action: EAct.ACTION7,
        name: "Receive notification",
        description:
          "User can receive the notification when a report status is changed to “Completed” (initial report status does not matter)",
      },
      {
        action: EAct.ALL,
        name: "All actions allowed",
        description: "User has all actions listed above in the permission",
      },
    ],
  },
  monitor: {
    section: permissionSections.monitor,
    name: "Monitor",
    actions: [
      {
        action: EAct.VIEW,
        name: "View model states list",
        description:
          "User can see the item in the navigation sidebar and open the list (by click or direct link) AND “cancel auto-update” is allowed",
      },
      {
        action: EAct.READ,
        name: "View model trend",
        description: "User can view trend of a model",
      },
      {
        action: EAct.UPDATE,
        name: "Edit model",
        description: "User can edit a model",
      },
      {
        action: EAct.ACTION0,
        name: "East Grafana monitor",
        description: "User is able to click on the East link to Grafana monitoring",
      },
      {
        action: EAct.ACTION1,
        name: "West Grafana monitor",
        description: "User is able to click on the West link to Grafana monitoring",
      },
      {
        action: EAct.ACTION2,
        name: "Model KPI Grafana monitor",
        description: "User is able to click on the Model KPI link to Grafana",
      },
      {
        action: EAct.ACTION7,
        name: "Receive notification",
        description: 'User can receive the notification “New model is registered“ and “Model execution status is changed“',
      },
      {
        action: EAct.ALL,
        name: "All actions allowed",
        description: "User has all actions listed above in the permission",
      },
    ],
  },
  offline_detection_model_evaluation: {
    section: permissionSections.operations,
    name: "Offline Detection & Model Evaluation",
    actions: [
      {
        action: EAct.READ,
        name: "View logs",
        description:
          "User can see the item in the navigation sidebar and open the page (by click or direct link) AND apply filters, set database toggle, press both “Show logs” buttons",
      },
      {
        action: EAct.ACTION0,
        name: "Calculate offline anomaly detection",
        description: 'User can press the button "Calculate" near offline anomaly detection',
      },
      {
        action: EAct.ACTION1,
        name: "Calculate prediction evaluation",
        description: "User can press the button “Calculate” near prediction evaluation",
      },
      {
        action: EAct.ALL,
        name: "All actions allowed",
        description: "User has all actions listed above in the permission",
      },
    ],
  },
  feature_correlation: {
    section: permissionSections.operations,
    name: "Feature Correlation",
    actions: [
      {
        action: EAct.READ,
        name: "View feature correlations",
        description:
          "User can see the item in the navigation sidebar and open the page (by click or direct link) AND apply filters, use “Search” and “Clear” buttons",
      },
      {
        action: EAct.DOWNLOAD,
        name: "Download feature correlations",
        description: "Use can download feature correlation in CSV file",
      },
      {
        action: EAct.ALL,
        name: "All actions allowed",
        description: "User has all actions listed above in the permission",
      },
    ],
  },
  feature_importance: {
    section: permissionSections.operations,
    name: "Feature Importance",
    actions: [
      {
        action: EAct.READ,
        name: "View feature importance",
        description:
          "User can see the item in the navigation sidebar and open the page (by click or direct link) AND apply filters, use “Search” and “Clear” buttons",
      },
      {
        action: EAct.DOWNLOAD,
        name: "Download feature importance",
        description: "Use can download feature importance as CSV, JPEG, and PNG AND use the print option",
      },
      {
        action: EAct.ALL,
        name: "All actions allowed",
        description: "User has all actions listed above in the permission",
      },
    ],
  },
  modeling: {
    section: permissionSections.operations,
    name: "Modeling",
    actions: [
      {
        action: EAct.VIEW,
        name: "View models list",
        description: "User can see the item in the navigation sidebar and open the list (by click or direct link)",
      },
      {
        action: EAct.CREATE,
        name: "Create new model",
        description: "User can create a new model from the scratch by the button in the header",
      },
      {
        action: EAct.READ,
        name: "View model details",
        description: "- User can view model details (3-dots-menu);\n- Open the model details page",
      },
      {
        action: EAct.UPDATE,
        name: "Create new model version",
        description: "- User can create a new version of a model (3-dots-menu);\n- Update the existing one (model details page: alarm conditions and monitor tags)",
      },
      { // 17-4
        action: EAct.DELETE,
        name: "Soft delete/Remove/Recover a model version",
        description: "- Soft delete a model version (model list page);\n- Recover a model version (model details page);- Remove the model (model details page)",
      },
      {
        action: EAct.ACTION0,
        name: "Train model",
        description:
          "User can initiate model training in the 3-dots-menu AND on the last step of model creation (review tab)",
      },
      {
        action: EAct.ACTION1,
        name: "Deploy model",
        description: "- Deploy a model;\n- Use “Exclude Tags”;\n- Use “Deploy Initial”;\n- Use “Reset Retraining”",
      },
      {
        action: EAct.ACTION2,
        name: "View model logs",
        description: "User can view model logs (3-dots-menu)",
      },
      {
        action: EAct.ACTION7,
        name: "Receive notification",
        description:
          "- User can receive the notification when model data is ready for training AND when model training is finished;\n- Set and receive the notification “Redeployed Model Reminder“",
      },
      {
        action: EAct.ALL,
        name: "All actions allowed",
        description: "User has all actions listed above in the permission",
      },
    ],
  },
  power_plant: {
    section: permissionSections.catalog,
    name: "Power Plant",
    actions: [
      {
        // 18-0
        action: EAct.VIEW,
        name: "View list of power plants",
        description:
          "See the “Catalog → Power Plants” item in the navigation sidebar and open the list of power plant units (by click or direct link)",
      },
      {
        // 18-1
        action: EAct.CREATE,
        name: "Create new power plant",
        description: "Create the set of Branch, Power Plant, and PP Unit by the Power Plant pop-up",
      },
      {
        // 18-2
        action: EAct.READ,
        name: "Read power plant details",
        description: "Read details of a power plant unit in the Power Plant pop-up",
      },
      {
        // 18-3
        action: EAct.UPDATE,
        name: "Edit power plant",
        description: "Edit the set of Branch, Power Plant, and PP Unit by the Power Plant pop-up",
      },
      {
        // 18-4
        action: EAct.DELETE,
        name: "Soft delete/Recover a Power Plant",
        description: "User can soft delete and recover a power plant",
      },
      {
        // 18-7
        action: EAct.ACTION0,
        name: "Link data from Data Lake",
        description: "Bulk data linkage from Data Lake to J-AIME",
      },
      {
        // 18-8
        action: EAct.ACTION1,
        name: "Read and edit templates",
        description: "See and edit templates on the Catalog → Templates page",
      },
      {
        action: EAct.ACTION7,
        name: "Receive notification",
        description: "User can receive the notification about powerplant connection and delete status",
      },
      {
        // 18-15
        action: EAct.ALL,
        name: "All actions allowed",
        description: "User has all actions listed above in the permission",
      },
    ],
  },
  equipment: {
    section: permissionSections.catalog,
    name: "Equipment",
    actions: [
      {
        // 21-0
        action: EAct.VIEW,
        name: "View list of equipment",
        description:
          "See the “Catalog → Models” item in the navigation sidebar and open the list of equipment (by click or direct link)",
      },
      {
        // 21-1
        action: EAct.CREATE,
        name: "Create new equipment",
        description: "Create a new equipment by adding a new base model",
      },
      {
        // 21-3
        action: EAct.UPDATE,
        name: "Update equipment",
        description: "Update base model",
      },
      {
        // 21-4
        action: EAct.DELETE,
        name: "Soft delete/Recover equipment",
        description: "User can soft delete and recover an equipment",
      },
      {
        // 21-15
        action: EAct.ALL,
        name: "All actions allowed",
        description: "All actions allowed",
      },
    ],
  },
  pid: {
    section: permissionSections.catalog,
    name: "PID",
    actions: [
      {
        // 22-0
        action: EAct.VIEW,
        name: "View list of PIDs",
        description:
          "See the “Catalog → PID” item in the navigation sidebar and open the list of PIDs (by click or direct link)",
      },
      {
        // 22-1
        action: EAct.CREATE,
        name: "Create new PID",
        description: "Create new Analog/Digital PID from PID creation pop-up",
      },
      {
        // 22-2
        action: EAct.READ,
        name: "Read PID details",
        description: "Open and read PID details pop-up",
      },
      {
        // 22-3
        action: EAct.UPDATE,
        name: "Update PID",
        description: "- Update PID details from PID creation pop-up;\n- Edit alarm conditions on PID details pop-up",
      },
      {
        // 22-4
        action: EAct.DELETE,
        name: "Soft delete/Recover a PID",
        description: "User can soft delete and recover a PID",
      },
      {
        // 22-5
        action: EAct.DOWNLOAD,
        name: "Export PIDs",
        description: "See and use the button “Export PID(s)” on the list of PIDs",
      },
      {
        // 22-6
        action: EAct.UPLOAD,
        name: "Import PIDs",
        description: "See and use the button “Import PID(s)” on the list of PIDs",
      },
      {
        // 22-7
        action: EAct.ACTION0,
        name: "Manage PID trend data",
        description: "- Collect data from Data Lake to Influx DB;\n- Import PID historical data from CSV to Influx DB",
      },
      {
        action: EAct.ACTION7,
        name: "Receive notification",
        description: "User can receive the notification about data collection status",
      },
      {
        // 22-15
        action: EAct.ALL,
        name: "All actions allowed",
        description: "All actions allowed",
      },
    ],
  },
  users: {
    section: permissionSections.users_roles,
    name: "Users",
    actions: [
      {
        action: EAct.VIEW,
        name: "View list of users",
        description: "User can see the item in the navigation sidebar and open the list (by click or direct link)",
      },
      {
        action: EAct.CREATE,
        name: "Add users",
        description: "User can add users from Azure AD",
      },
      {
        action: EAct.UPDATE,
        name: "Edit user",
        description: "User can edit a user",
      },
      {
        action: EAct.DELETE,
        name: "Remove user",
        description: "User can remove a user",
      },
      {
        action: EAct.ACTION0,
        name: "Activate/deactivate user",
        description: "User can activate and deactivate a user",
      },
      {
        action: EAct.ALL,
        name: "All actions allowed",
        description: "User has all actions listed above in the permission",
      },
    ],
  },
  roles: {
    section: permissionSections.users_roles,
    name: "Roles",
    actions: [
      {
        action: EAct.VIEW,
        name: "View list of roles",
        description: "User can see the item in the navigation sidebar and open the list (by click or direct link)",
      },
      {
        action: EAct.CREATE,
        name: "Add roles",
        description: "User can add a new role from scratch AND create a new role by duplicating an existing one",
      },
      {
        action: EAct.READ,
        name: "View role details",
        description:
          "User can view role details in the user edit pop-up: all tabs available, all controls are disabled",
      },
      {
        action: EAct.UPDATE,
        name: "Edit role",
        description: "User can view and edit role details in the user edit pop-up: all tabs available",
      },
      {
        action: EAct.DELETE,
        name: "Remove role",
        description: "User can remove a role",
      },
      {
        action: EAct.ACTION0,
        name: "Activate/deactivate role",
        description: "User can activate and deactivate a role",
      },
      {
        action: EAct.ALL,
        name: "All actions allowed",
        description: "User has all actions listed above in the permission",
      },
    ],
  },
};
