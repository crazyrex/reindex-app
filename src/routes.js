import React from 'react';
import { Route, IndexRoute } from 'react-router';
import {
  App,
  NotFound,
  Admin,
  AdminSearch,
  AdminRequests,
  AdminSettings,
  AdminUsers,
  ArchivesRequests,
  ArchivesRecords,
  AdminSearchHistory,
  AdminCategories,
  AdminRecordsPage,
  MainSearch,
  LandingPage,
  RecordPage,
  ThanksPage,
  AuthPage,
  ResultsPage,
  ContactUs,
  CampaignPage,
  CampaignVideoPage,
  LotteryPage,
  EditComponent,
  Thank,
  LandscapePage
} from 'containers';

export default () => {
  const routes = (
    <Route path="/" component={App}>
      <IndexRoute component={MainSearch} />
      <Route path="/landing-page" component={LandingPage} />
      <Route path="/campaign/:num" component={CampaignPage} />
      <Route path="/campvideo/:num" component={CampaignVideoPage} />
      <Route path="/contact-us" component={ContactUs} />
      <Route path="/thanks" component={ThanksPage} />
      <Route path="/thank" component={Thank} />
      <Route path="/newUpdateMain" component={Thank} />
      <Route path="/updatedBusiness" component={Thank} />
      <Route path="/updatedPeople" component={Thank} />
      <Route path="/lottery" component={LotteryPage} />
      <Route path="/auth/:loginType" component={AuthPage} />
      <Route path="/admin" component={Admin}>
        <Route path="/admin/search" component={AdminSearch} />
        <Route path="/admin/requests" component={AdminRequests} />
        <Route path="/admin/history" component={AdminSearchHistory} />
        <Route path="/admin/settings" component={AdminSettings} />
        <Route path="/admin/categories" component={AdminCategories} />
        <Route path="/admin/records" component={AdminRecordsPage} />
        <Route path="/admin/archivesrequests" component={ArchivesRequests} />
        <Route path="/admin/ArchivesRecords" component={ArchivesRecords} />
        <Route path="/admin/users" component={AdminUsers}/>
        <Route path="/admin/edit" component={EditComponent}/>
      </Route>
      <Route path="/cat(/:catName)" component={ResultsPage} />
      <Route path="/landscape" component={LandscapePage} />
      <Route path="/ppls" component={ResultsPage} />
      <Route path="/biz" component={RecordPage} />
      <Route path="/biz/:recordId/:recordName" component={RecordPage} />
      <Route path="/ppl/:recordId/:recordName" component={RecordPage} />
      <Route path="/404" component={NotFound} />
      <Route path="*" component={NotFound} />
    </Route>
  );
  return routes;
};
