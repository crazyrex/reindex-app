import React from 'react';
import { ShareButtons, generateShareIcon } from 'react-share';
import IconButton from 'material-ui/IconButton';
import PhoneIcon from 'material-ui/svg-icons/communication/call';
import MailIcon from 'material-ui/svg-icons/content/mail';
import './SocialBtns.scss';
//import { generateIcon } from 'react-share/lib/generateIcon';

const {
  FacebookShareButton,
  GooglePlusShareButton,
  TwitterShareButton,
  WhatsappShareButton
} = ShareButtons;
const FacebookIcon = generateShareIcon('facebook');
const TwitterIcon = generateShareIcon('twitter');
const GooglePlusIcon = generateShareIcon('google');
const WhatsappIcon = generateShareIcon('whatsapp');

const saveToGTM = (type, cardname) => {
  dataLayer.push({
    'event': 'clickSocial', 'cardname': cardname,
    'type': type
  });
}
function SocialBtns(props) {
  if (typeof location === undefined || typeof location === 'undefined') return (<div></div>);
  return (
    <div className="wrapper-socialBtns">
      <div onClick={() => saveToGTM('facebook', props.data.business_name)}>
        <FacebookShareButton
          url={props.data.link ? (location.origin + props.data.link) : location.href}
          title={'Reindex'}
        >
          <FacebookIcon
            size={32}
            round
          />
        </FacebookShareButton>
      </div>
      <div onClick={() => saveToGTM('twitter', props.data.business_name)}>
        <TwitterShareButton
          url={props.data.link ? (location.origin + props.data.link) : location.href}
          title={'Reindex'}
        >
          <TwitterIcon
            size={32}
            round
          />
        </TwitterShareButton>
      </div>
      <div onClick={() => saveToGTM('whatsapp', props.data.business_name)}>
        <WhatsappShareButton
          url={`whatsapp://send?text=Reindex${(props.data.business_name || (props.data.first_name + ' ' + props.data.last_name))} ${(props.data.link ? (location.origin + props.data.link) : location.href)}`}
          title={'Reindex'}
        >
          <WhatsappIcon
            size={32}
            round
          />
        </WhatsappShareButton>
      </div>
      <div onClick={() => saveToGTM('mail', props.data.business_name)}>
        <IconButton
          className="share-mail"
          style={{ width: '31px', height: '31px' }}
          href={`mailto:?subject=Reindex&body=${(props.data.business_name || (props.data.first_name + ' ' + props.data.last_name))} ${(props.data.link ? (location.origin + props.data.link) : location.href)}`}
          iconStyle={{ color: 'white', width: '17px', height: '17px' }}>
          <MailIcon />
        </IconButton>
      </div>
    </div>
  );
}

SocialBtns.propTypes = {
  data: React.PropTypes.object,
};


export default SocialBtns;
