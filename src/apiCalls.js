export const getUrls = () => {
  return fetch('http://localhost:3001/api/v1/urls')
      .then(response => response.json())
      .catch(err => console.error(err))
}

export const postUrl = (url, title) => {
  const body = {
    long_url: url,
    title
  }

  return fetch('http://localhost:3001/api/v1/urls', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(err => console.error(err))
}