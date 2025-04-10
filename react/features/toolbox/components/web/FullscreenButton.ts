import { connect } from 'react-redux';

import { createToolbarEvent } from '../../../analytics/AnalyticsEvents';
import { sendAnalytics } from '../../../analytics/functions';
import { IReduxState } from '../../../app/types';
import { isIosMobileBrowser } from '../../../base/environment/utils';
import { translate } from '../../../base/i18n/functions';
import { IconEnterFullscreen, IconExitFullscreen } from '../../../base/icons/svg';
import AbstractButton, { IProps as AbstractButtonProps } from '../../../base/toolbox/components/AbstractButton';
import { closeOverflowMenuIfOpen, setFullScreen } from '../../actions.web';

interface IProps extends AbstractButtonProps {

    /**
    * Whether or not the app is currently in full screen.
    */
    _fullScreen?: boolean;
}

/**
 * Implementation of a button for toggling fullscreen state.
 */
class FullscreenButton extends AbstractButton<IProps> {
    override accessibilityLabel = 'toolbar.accessibilityLabel.enterFullScreen';
    override toggledAccessibilityLabel = 'toolbar.accessibilityLabel.exitFullScreen';
    override label = 'toolbar.enterFullScreen';
    override toggledLabel = 'toolbar.exitFullScreen';
    override tooltip = 'toolbar.enterFullScreen';
    override toggledTooltip = 'toolbar.exitFullScreen';
    override toggledIcon = IconExitFullscreen;
    override icon = IconEnterFullscreen;

    /**
     * Indicates whether this button is in toggled state or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    override _isToggled() {
        return this.props._fullScreen;
    }

    /**
    * Handles clicking the button, and toggles fullscreen.
    *
    * @private
    * @returns {void}
    */
    override _handleClick() {
        const { dispatch, _fullScreen } = this.props;

        sendAnalytics(createToolbarEvent(
            'toggle.fullscreen',
            {
                enable: !_fullScreen
            }));
        dispatch(closeOverflowMenuIfOpen());

        dispatch(setFullScreen(!_fullScreen));
    }
}

/**
 * Function that maps parts of Redux state tree into component props.
 *
 * @param {Object} state - Redux state.
 * @returns {Object}
 */
const mapStateToProps = (state: IReduxState) => {
    return {
        _fullScreen: state['features/toolbox'].fullScreen,
        visible: !isIosMobileBrowser()
    };
};

export default translate(connect(mapStateToProps)(FullscreenButton));
