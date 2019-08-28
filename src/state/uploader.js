import React from 'react';
import { Progress } from '@fogcreek/shared-components';

import { uploadAsset, uploadAssetSizes } from 'Utils/assets';
import { captureException } from 'Utils/sentry';
import { useNotifications } from 'State/notifications';
import Text from 'Components/text/text';

const NotifyUploading = ({ progress }) => (
  <>
    <Text>Uploading asset</Text>
    <Progress value={progress} max={100}>{progress}%</Progress>
  </>
);
const NotifyError = ({ error }) => {
  if (error && error.status_code === 0) {
    return 'File upload failed. Check your firewall settings and try again?';
  }
  return 'File upload failed. Try again in a few minutes?';
};

async function uploadWrapper(notifications, upload) {
  let result = null;
  let progress = 0;
  const { updateNotification, removeNotification } = notifications.createNotification(<NotifyUploading progress={progress} />, {
    persistent: true,
  });
  try {
    result = await upload(({ lengthComputable, loaded, total }) => {
      if (lengthComputable) {
        progress = loaded / total;
      } else {
        progress = (progress + 1) / 2;
      }
      updateNotification(<NotifyUploading progress={progress} />);
    });
  } catch (error) {
    captureException(error);
    notifications.createErrorNotification(<NotifyError error={error} />);
    removeNotification();
    return result;
  }

  removeNotification();
  notifications.createNotification('Image uploaded!', { type: 'success' });
  return result;
}

const useUploader = () => {
  const notifications = useNotifications();
  return {
    uploadAsset: (blob, policy, key) => uploadWrapper(notifications, (cb) => uploadAsset(blob, policy, key, cb)),
    uploadAssetSizes: (blob, policy, sizes) => uploadWrapper(notifications, (cb) => uploadAssetSizes(blob, policy, sizes, cb)),
  };
};

export default useUploader;
