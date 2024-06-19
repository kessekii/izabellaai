import React, { Component } from 'react';
import combineImages from '../actions/combinePhotos';

class ImageCombiner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            combinedImage: '',
            showPopup: false,
        };
    }

    handleCombineImages = async () => {
        const { base64Image, arrayImage, arrayWidth = 880, arrayHeight = 880 } = this.props;

        const combinedImageDataUrl = await combineImages(base64Image, arrayImage, arrayWidth, arrayHeight);
        this.setState({
            combinedImage: combinedImageDataUrl,
            showPopup: true,
        });
    };

    closePopup = () => {
        this.setState({ showPopup: false });
    };

    render() {
        const { combinedImage, showPopup } = this.state;

        return (
            showPopup && (
                <div style={popupStyle}>
                    <div style={popupContentStyle}>
                        <span style={closeButtonStyle} onClick={this.closePopup}>&times;</span>
                        <img src={combinedImage} alt="Combined" />
                    </div>
                </div>
            )
        );
    }
}

const popupStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
};

const popupContentStyle = {
    position: 'relative',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center',
};

const closeButtonStyle = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    fontSize: '24px',
    cursor: 'pointer',
};

export default ImageCombiner;