interface InfoItem {
  title: string;
  dec?: string;
  hasLocationBtn?: boolean;
  hasContactBtn?: boolean;
  longitude?: number;
  latitude?: number;
  contactorList?: any;
}

export interface InformationListDto {
  mainInfo: InfoItem[];
  _moreInfo: InfoItem[];
  hasAttention?: boolean;
}

export interface FooterBtnDto {
  type: string;
  icon: string;
  dec: string;
  activeClass: string;
}
