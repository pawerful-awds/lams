import express, { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import url from 'url';

import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { handleServiceResponse } from '@/common/utils/httpHandlers';
import { db, admin } from '@/services/firebase';
import { logger } from '@/server';

const bucket = admin.storage().bucket();

const getFilePathFromUrl = (fileUrl: string) => {
  const parsedUrl = new URL(fileUrl);
  const pathname = parsedUrl.pathname.split('/');
  return decodeURIComponent(pathname.slice(2).join('/'));
};

export const downloadRouter: Router = (() => {
  const router = express.Router();

  router.get('/:animationId', async (req: Request, res: Response) => {
    const animationId = req.params.animationId;
    try {
      const doc = await db.collection('animations').doc(animationId).get();
      if (!doc.exists) {
        throw new Error("There's no animation file with this Id");
      }
      const data = doc.data();
      const fileName = getFilePathFromUrl(data?.url);
      const file = bucket.file(fileName);
      const [exists] = await file.exists();

      if (!exists) {
        throw new Error('File not found');
      }

      const contentType = file.metadata.contentType;

      res.setHeader('Content-Type', contentType ?? '');
      res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);
      res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

      file
        .createReadStream()
        .on('error', (err) => {
          throw new Error('Error downloading animation file');
        })
        .pipe(res);
    } catch (err) {
      const errorMessage = `Error downloading file: ${(err as Error).message}`;
      logger.error(errorMessage);
      return handleServiceResponse(
        new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR),
        res
      );
    }
  });

  return router;
})();
