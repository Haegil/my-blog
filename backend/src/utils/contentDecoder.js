function decodePostPayload(payload) {
  if (payload?.contentEncoding !== 'base64') {
    return payload;
  }

  try {
    return {
      ...payload,
      content: Buffer.from(payload.content || '', 'base64').toString('utf8'),
    };
  } catch {
    const error = new Error('본문 인코딩을 해석할 수 없습니다.');
    error.status = 400;
    throw error;
  }
}

module.exports = {
  decodePostPayload,
};
