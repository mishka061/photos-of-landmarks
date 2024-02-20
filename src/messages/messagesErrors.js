// messages\messagesErrors.js
export const messagesError = {
  errors: {
    authorizationError: "Авторизация не выполнена",
    postLoginAdminError: "Ошибка в функции postLoginAdmin",
    getLoginAdminError: "Ошибка в функции getLoginAdmin",
    AdminNotDefined: "Админ не определен",
    internalServerError: "Ошибка внутреннего сервера",
    getAdminPanelError: "Ошибка в функции getAdminPanel",
    postAdminPanelError: "Ошибка в функции postAdminPanel",
    registrationError: "Регистрация не выполнена",
    getRegisterAdminError: "Ошибка в функции getRegisterAdmin",
    postRegisterAdminError: "Ошибка в функции postRegisterAdmin",
    userNotDefined: "Пользователь в базе данных не найден",
    loginEndEmailError:
      "Пользователь с таким логином и электронной почтой уже существует",
    emailEndLoginlNotFoundError:
      "Пользователь с такой почтой или паролем не найден",
    notLoginError: "Пользователь с таким логином уже существует",
    notEmailError: "Пользователь с такой электронной почтой уже существует",
    postAuthorizationError: "Ошибка в функции postAuthorization",
    photoRecordNotFound: "Запись фотографии не найдена для _id:",
    postAddCommentError: "Ошибка в функции postAddComment",
    photoNotFound: "Фотография не найдена",
    postSearhError: "Ошибка в функции postSearch",
    deleteError: "Ошибка в удалении записи",
    getModeratorError: "Ошибка в функции getModerator",
    commentNotFound: "Комментарий не найден",
    postReplyCommitError: "Ошибка в функции postReplyCommit",
    tokenMissingRequest: "Токен отсутствует в запросе",
    tokenVerificationError: "Ошибка при верификации токена",
    getMainError: "Ошибка в функции getMain",
    LikeError: "Ошибка в postAddLike",
    postAddPhotoError: "Ошибка в функции postAddPhoto",
    getAddPhotoError: "Ошибка в функции getAddPhoto",
    parsingError: "Ошибка во время парсинга и сохранения",
    titleError : "Страница не найдена"
  },
};

console.log("messages.js has been imported");
