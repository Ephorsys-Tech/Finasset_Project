import { NextResponse } from 'next/server';

export function sendSuccess(data = null, message = 'Success', status = 200, meta = {}) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
      ...meta,
    },
    { status }
  );
}

export function sendError(message = 'Internal server error', status = 500, error = null) {
  return NextResponse.json(
    {
      success: false,
      message,
      error: error && typeof error === 'object' ? error.message : error,
    },
    { status }
  );
}

export function sendBadRequest(message = 'Invalid input data', errors = null) {
  return NextResponse.json(
    {
      success: false,
      message,
      errors,
    },
    { status: 400 }
  );
}

export function sendUnauthorized(message = 'Unauthorized: Access token missing or invalid') {
  return NextResponse.json(
    {
      success: false,
      message,
    },
    { status: 401 }
  );
}

export function sendForbidden(message = 'Forbidden: Access denied') {
  return NextResponse.json(
    {
      success: false,
      message,
    },
    { status: 403 }
  );
}

export function sendNotFound(message = 'Requested resource not found') {
  return NextResponse.json(
    {
      success: false,
      message,
    },
    { status: 404 }
  );
}

export default {
  sendSuccess,
  sendError,
  sendBadRequest,
  sendUnauthorized,
  sendForbidden,
  sendNotFound,
};
