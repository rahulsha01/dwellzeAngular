import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
// import { StorageService } from './local-data.service';
// import { AppState } from './state-management.service';
import {
  HttpClient,
  HttpResponse,
  HttpErrorResponse,
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpHeaders
} from '@angular/common/http';

import * as fromModel from '../models';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { StorageService } from './local-data.service';
import { CryptoService } from './crypto.service';
@Injectable({
  providedIn: 'root'
})
export class ApiService implements HttpInterceptor {
  URL = environment.baseUrl;
  imageSize = 3;
  imagePath = 'http://50.63.12.99:8080/storage/img/';
  urls = {
    flatType: {
      all: 'UnitTypeWS/getUnitTypes',
      save: 'UnitTypeWS/postUnitType',
      delete: 'UnitTypeWS/deleteUnitTypes'
    },
    primaryMember: {
      all: 'PMWS/getPM',
      save: 'PMWS/postMember',
      delete: 'PMWS/deletePM'
    },
    helpline: {
      all: 'HelpLineWS/getHelpLine',
      save: 'HelpLineWS/postHelpLine',
      delete: 'HelpLineWS/deleteHelpLine'
    },
    lovs: {
      all: 'LovWS/getLOVS'
    },
    requestType: {
      all: 'ReqDocWS/getReqDoc'
    },
    societyStaff: {
      all: 'SocStaffWS/getSS',
      save: 'SocStaffWS/postSS',
      delete: 'SocStaffWS/deleteSS'
    },
    societyCommittee: {
      all: 'SocCommWS/getSCM',
      save: 'SocCommWS/postSCM',
      delete: 'SocCommWS/deleteSCM'
    },
    MtgSchedule: {
      all: 'MtgSchWS/getMtgSch',
      save: 'MtgSchWS/postMtgSch',
      delete: 'MtgSchWS/deleteMtgSch'
    },
    event: {
      all: 'EventsWS/getEvents',
      save: 'EventsWS/postEvents',
      delete: 'EventsWS/deleteEvents'
    },
    eventParticipation: {
      all: 'EventsBookingWS/getEventsBooking',
      save: '',
      delete: ''
    },
    society: {
      all: 'socWS/getSocByID',
      save: 'socWS/postSoc'
    },
    wings: {
      all: 'WingsWS/getWings',
      save: 'WingsWS/postWings',
      delete: 'WingsWS/deleteWings'
    },
    amenities: {
      all: 'AmentiesWS/getAmenities',
      save: 'AmentiesWS/postAmenties',
      delete: 'AmentiesWS/deleteAmenities'
    },
    Assets: {
      all: 'AssetsWS/getAssets',
      save: 'AssetsWS/postAssets',
      delete: 'AssetsWS/deleteAssets'
    },
    Gates: {
      all: 'GatesWS/getGates',
      save: 'GatesWS/postGates',
      delete: 'GatesWS/deleteGates'
    },
    primaryFamily: {
      all: 'MemFamilyWS/getFamily',
      save: 'MemFamilyWS/postFamily',
      delete: 'MemFamilyWS/deleteFM'
    },
    primaryVehicle: {
      all: 'MemVehWS/getVeh',
      save: 'MemVehWS/postVeh',
      delete: 'MemVehWS/deleteVeh',
      getVehBrand: 'MemVehWS/getDistinctVeh'
    },
    primaryStaff: {
      all: 'MemStaffWS/getStaff',
      save: 'MemStaffWS/postStaff',
      delete: 'MemStaffWS/deleteMS'
    },

    complain: {
      all: 'CompWS/getComps',
      save: 'CompWS/postComp',
      delete: 'CompWS/deleteComp'
    },
    billingCharges: {
      all: 'ChargeMasterWS/getChargeMaster',
      save: 'ChargeMasterWS/postChargeMaster',
      delete: 'ChargeMasterWS/deleteChargeMaster'
    },
    service: {
      all: 'ServiceWS/getService'
    },
    vendor: {
      all: 'ServiceWS/getVendor4Services'
    },
    vendorApproval: {
      save: 'VendorSocietyWS/postVndSoc'
    },
    singleVendorInfo: {
      all: 'VendorWS/getVendors'
    },
    vendorSubServices: {
      all: 'ServiceWS/getSubSrvBySrv'
    },
    vendorSingleSubService: {
      all: 'SubServiceWS/getSubService'
    },
    processVendorSubServices: {
      all: 'VSPWS/getVSProcess'
    },
    vendorSingleSubServiceAddOn: {
      all: 'VndSrvWS/getVS'
    },
    vendorDocument: {
      all: 'ImagesWS/getGroupedImages'
    },
    requestList: {
      all: 'LovWS/getLOVS'
    },
    requestDocumentList: {
      all: 'ReqDocWS/getReqDoc',
      save: 'ReqDocWS/postReqDocMap',
      delete: 'ReqDocWS/deleteRDM'
    },
    processRaiseRequest: {
      all: 'RaiseRequestWS/getRR'
    },
    album: {
      new: 'AlbumsWS/postAlbums',
      all: 'AlbumsWS/getAlbums'
    },
    login: {
      save: 'SocAdminWS/getSociety'
    },
    noticeBoard: {
      all: 'NoticeBoardWS/getNB',
      save: 'NoticeBoardWS/postNB',
      delete: '/NoticeBoardWS/deleteNB'
    },
    upload: {
      save: 'PMWS/uploadFile'
    }
  };

  get currentDate() {
    return new Date();
  }


  constructor(
    private http: HttpClient
  ) { } // private storage: StorageService,

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const dubReq = req.clone({
      url: this.URL + req.url
    });
    return next.handle(dubReq);
  }

  // Start of Unit type Services
  newFlatType(payload): Observable<fromModel.Response> {
    return this.http
      .post(this.urls.flatType.save, payload)
      .pipe(map((data: fromModel.Response) => data));
  }

  allFlatType(payload) {
    return this.http.post(this.urls.flatType.all, payload);
  }

  deleteFlatType(payload) {
    return this.http.post(this.urls.flatType.delete, payload).pipe(map((data: fromModel.Response) => data));
  }
  // End Unit type Services

  // Start of BillingCharges Services
  newBillingCharges(payload): Observable<fromModel.Response> {
    return this.http
      .post(this.urls.billingCharges.save, payload)
      .pipe(map((data: fromModel.Response) => data));
  }

  allBillingCharges(payload) {
    return this.http.post(this.urls.billingCharges.all, payload);
  }

  deleteBillingCharges(payload) {
    return this.http.post(this.urls.billingCharges.delete, payload);
  }
  // End BillingCharges Services

  // Start of PrimaryMember
  newPrimaryMember(payload): Observable<fromModel.Response> {
    return this.http
      .post(this.urls.primaryMember.save, payload)
      .pipe(map((data: fromModel.Response) => data));
  }

  allPrimaryMember(payload) {
    return this.http.post(this.urls.primaryMember.all, payload);
  }

  deletePrimaryMember(payload) {
    return this.http.post(this.urls.primaryMember.delete, payload);
  }
  // End of PrimaryMember



  // Start of Helpline
  newHelpline(payload): Observable<fromModel.Response> {
    return this.http
      .post(this.urls.helpline.save, payload)
      .pipe(map((data: fromModel.Response) => data));
  }

  allHelpline(payload) {
    return this.http.post(this.urls.helpline.all, payload);
  }

  deleteHelpline(payload) {
    return this.http.post(this.urls.helpline.delete, payload);
  }
  // End of Helpline



  // Start of Lovs
  allLovs(payload) {
    return this.http.post(this.urls.lovs.all, payload);
  }
  // End of Lovs

  // Start of requestType
  getRequestType(payload) {
    return this.http.post(this.urls.requestType.all, payload);
  }
  // End of requestType

  // Start of Society Staff
  newSocietyStaff(payload): Observable<fromModel.Response> {
    return this.http
      .post(this.urls.societyStaff.save, payload)
      .pipe(map((data: fromModel.Response) => data));
  }
  allSocietyStaff(payload) {
    return this.http.post(this.urls.societyStaff.all, payload);
  }
  deleteSocietyStaff(payload) {
    return this.http.post(this.urls.societyStaff.delete, payload);
  }
  // End of Society Staff



  // Start of Society Committee
  newSocietyCommittee(payload): Observable<fromModel.Response> {
    return this.http
      .post(this.urls.societyCommittee.save, payload)
      .pipe(map((data: fromModel.Response) => data));
  }
  allSocietyCommittee(payload) {
    return this.http.post(this.urls.societyCommittee.all, payload);
  }
  deleteSocietyCommittee(payload) {
    return this.http.post(this.urls.societyCommittee.delete, payload).pipe(map((data: fromModel.Response) => data));
  }
  // End of Society Committee



  // Start of Meetings
  newMtgSchedule(payload): Observable<fromModel.Response> {
    return this.http
      .post(this.urls.MtgSchedule.save, payload)
      .pipe(map((data: fromModel.Response) => data));
  }
  allMtgSchedule(payload) {
    return this.http.post(this.urls.MtgSchedule.all, payload);
  }
  deleteMtgSchedule(payload) {
    return this.http.post(this.urls.MtgSchedule.delete, payload);
  }

  // Start of Event
  newEvent(payload): Observable<fromModel.Response> {
    return this.http
      .post(this.urls.event.save, payload)
      .pipe(map((data: fromModel.Response) => data));
  }
  allEvent(payload) {
    return this.http.post(this.urls.event.all, payload);
  }

  allEventParticipation(payload) {
    return this.http.post(this.urls.eventParticipation.all, payload);
  }
  deleteEvent(payload) {
    return this.http.post(this.urls.event.delete, payload);
  }
  // End of Event

  // start of society
  updateSociety(payload): Observable<fromModel.Response> {
    return this.http
      .post(this.urls.society.save, payload)
      .pipe(map((data: fromModel.Response) => data));
  }

  getSociety(payload) {
    return this.http.post(this.urls.society.all, payload);
  }

  // start of wings
  newWings(payload): Observable<fromModel.Response> {
    return this.http
      .post(this.urls.wings.save, payload)
      .pipe(map((data: fromModel.Response) => data));
  }

  allWings(payload) {
    return this.http.post(this.urls.wings.all, payload);
  }

  deleteWings(payload) {
    return this.http.post(this.urls.wings.delete, payload).pipe(map((data: fromModel.Response) => data));
  }


  // start of amenities
  newAmenities(payload): Observable<fromModel.Response> {
    const header = new HttpHeaders();
    header.append('Content-Type', 'multipart/form-data');
    return this.http
      .post(this.urls.amenities.save, payload, { headers: header })
      .pipe(map((data: fromModel.Response) => data));
  }

  allAmenities(payload) {
    return this.http.post(this.urls.amenities.all, payload);
  }

  deleteAmenities(payload) {
    return this.http.post(this.urls.amenities.delete, payload);
  }



  // start of assets
  newAssets(payload): Observable<fromModel.Response> {
    return this.http
      .post(this.urls.Assets.save, payload)
      .pipe(map((data: fromModel.Response) => data));
  }

  allAssets(payload) {
    return this.http.post(this.urls.Assets.all, payload);
  }

  deleteAssets(payload) {
    return this.http.post(this.urls.Assets.delete, payload);
  }



  // start of gates
  newGates(payload): Observable<fromModel.Response> {
    return this.http
      .post(this.urls.Gates.save, payload)
      .pipe(map((data: fromModel.Response) => data));
  }

  allGates(payload) {
    return this.http.post(this.urls.Gates.all, payload);
  }

  deleteGates(payload) {
    return this.http.post(this.urls.Gates.delete, payload);
  }
  // end of gates

  // start of family
  newFamily(payload): Observable<fromModel.Response> {
    return this.http
      .post(this.urls.primaryFamily.save, payload)
      .pipe(map((data: fromModel.Response) => data));
  }

  allFamily(payload) {
    return this.http.post(this.urls.primaryFamily.all, payload);
  }

  deleteFamily(payload) {
    return this.http.post(this.urls.primaryFamily.delete, payload);
  }
  // end of family

  // start of Vehicle
  newVehicle(payload): Observable<fromModel.Response> {
    return this.http
      .post(this.urls.primaryVehicle.save, payload)
      .pipe(map((data: fromModel.Response) => data));
  }

  allVehicle(payload) {
    return this.http.post(this.urls.primaryVehicle.all, payload);
  }

  deleteVehicle(payload) {
    return this.http.post(this.urls.primaryVehicle.delete, payload);
  }

  getVehBrandData(payload) {
    return this.http.post(this.urls.primaryVehicle.getVehBrand, payload);
  }
  // end of Vehicle

  // start of Staff
  newStaff(payload): Observable<fromModel.Response> {
    return this.http
      .post(this.urls.primaryStaff.save, payload)
      .pipe(map((data: fromModel.Response) => data));
  }

  allStaff(payload) {
    return this.http.post(this.urls.primaryStaff.all, payload);
  }

  deleteStaff(payload) {
    return this.http.post(this.urls.primaryStaff.delete, payload);
  }
  // end of Staff

  // start of CommunicationPreferences
  newCommunicationPreferences(payload): Observable<fromModel.Response> {
    return this.http
      .post(this.urls.primaryFamily.save, payload)
      .pipe(map((data: fromModel.Response) => data));
  }

  allCommunicationPreferences(payload) {
    return this.http.post(this.urls.primaryFamily.all, payload);
  }

  deleteCommunicationPreferences(payload) {
    return this.http.post(this.urls.primaryFamily.delete, payload);
  }
  // end of CommunicationPreferences

  // start of amenities
  newComplain(payload): Observable<fromModel.Response> {
    return this.http
      .post(this.urls.complain.save, payload)
      .pipe(map((data: fromModel.Response) => data));
  }

  allComplain(payload) {
    return this.http.post(this.urls.complain.all, payload);
  }

  deleteComplain(payload) {
    return this.http.post(this.urls.complain.delete, payload);
  }

  // service
  allService(payload) {
    return this.http.post(this.urls.service.all, payload);
  }

  allVendor(payload) {
    return this.http.post(this.urls.vendor.all, payload);
  }

  newVendorApproval(payload) {
    return this.http.post(this.urls.vendorApproval.save, payload);
  }

  allSingleVendorInfo(payload) {
    return this.http.post(this.urls.singleVendorInfo.all, payload);
  }

  allVendorSubServices(payload) {
    return this.http.post(this.urls.vendorSubServices.all, payload);
  }
  allVendorDocument(payload) {
    return this.http.post(this.urls.vendorDocument.all, payload);
  }

  allVendorSingleSubServices(payload) {
    return this.http.post(this.urls.vendorSingleSubService.all, payload);
  }
  allVendorSingleSubServicesAddOn(payload) {
    return this.http.post(this.urls.vendorSingleSubServiceAddOn.all, payload);
  }
  allProcessVendorSingleSubservices(payload) {
    return this.http.post(this.urls.processVendorSubServices.all, payload);
  }
  // Request Type

  allRequestList(payload) {
    return this.http.post(this.urls.requestList.all, payload);
  }

  allDocumentList(payload) {
    return this.http.post(this.urls.requestDocumentList.all, payload);
  }

  newSingleSelectedDocList(payload) {
    return this.http.post(this.urls.requestDocumentList.save, payload);
  }

  deleteSingleDocList(payload) {
    return this.http.post(this.urls.requestDocumentList.delete, payload);
  }

  newAlbum(payload) {
    return this.http.post(this.urls.album.new, payload);
  }

  allAlbum(payload) {
    return this.http.post(this.urls.album.all, payload);
  }

  // Process Request
  allProcessRaiseRequest(payload) {
    return this.http.
      post(this.urls.processRaiseRequest.all, payload)
      .pipe(map((response: any) => {
        response.DATA[0].name = (response.DATA[0].pm_firstname).concat(' ' + response.DATA[0].pm_lastname);
        return response;
      }));
  }

  // login
  newLogin(payload) {
    return this.http.post(this.urls.login.save, payload);
  }

  newBillingRules(payload): Observable<fromModel.Response> {
    return this.http
      .post(this.urls.society.save, payload)
      .pipe(map((data: fromModel.Response) => data));
  }

  allBillingRules(payload) {
    return this.http.post(this.urls.society.all, payload);
  }

  // notice

  newNoticeBoard(payload): Observable<fromModel.Response> {
    return this.http
      .post(this.urls.noticeBoard.save, payload)
      .pipe(map((data: fromModel.Response) => data));
  }

  allNoticeBoard(payload) {
    return this.http.post(this.urls.noticeBoard.all, payload);
  }

  deleteNoticeBoard(payload) {
    return this.http.post(this.urls.noticeBoard.delete, payload).pipe(map((data: fromModel.Response) => data));
  }
  // upload Document
  newUploadDocument(payload) {
    return this.http.post(this.urls.upload.save, payload);
  }
}
