const logout = new LogoutButton();

logout.action = () => {
  ApiConnector.logout((responseBody) => {
    if (responseBody.success) {
      location.reload();
    }
  });
};

ApiConnector.current((responseBody) => {
  if (responseBody.success) {
    ProfileWidget.showProfile(responseBody.data);
  }
});

const ratesBoard = new RatesBoard();

const ratesBoardUpdate = () => {
  ApiConnector.getStocks((responseBody) => {
    if (responseBody.success) {
      ratesBoard.clearTable();
      ratesBoard.fillTable(responseBody.data);
    }
  });
};

ratesBoardUpdate();
setInterval(ratesBoardUpdate, 60000);

const moneyManager = new MoneyManager();

moneyManager.addMoneyCallback = ({ currency, amount }) => {
  ApiConnector.addMoney({ currency, amount }, (responseBody) => {
    if (responseBody.success) {
      ProfileWidget.showProfile(responseBody.data);
      moneyManager.setMessage(
        true,
        `Сумма ${amount} ${currency} успешно зачислена на ваш счёт`
      );
    } else {
      moneyManager.setMessage(false, responseBody.error);
    }
  });
};

moneyManager.conversionMoneyCallback = ({
  fromCurrency,
  targetCurrency,
  fromAmount,
}) => {
  ApiConnector.convertMoney(
    { fromCurrency, targetCurrency, fromAmount },
    (responseBody) => {
      if (responseBody.success) {
        ProfileWidget.showProfile(responseBody.data);
        moneyManager.setMessage(
          true,
          `${fromAmount} ${fromCurrency} успешно конвертированны в ${targetCurrency}`
        );
      } else {
        moneyManager.setMessage(false, responseBody.error);
      }
    }
  );
};

moneyManager.sendMoneyCallback = ({ to, currency, amount }) => {
  ApiConnector.transferMoney({ to, currency, amount }, (responseBody) => {
    if (responseBody.success) {
      ProfileWidget.showProfile(responseBody.data);
      moneyManager.setMessage(
        true,
        `${amount} ${currency} успешно переведены ${to}`
      );
    } else {
      moneyManager.setMessage(false, responseBody.error);
    }
  });
};

const favoritesWidget = new FavoritesWidget();

const updateFavorites = (responseBody) => {
  favoritesWidget.clearTable();
  favoritesWidget.fillTable(responseBody.data);
  moneyManager.updateUsersList(responseBody.data);
};

ApiConnector.getFavorites((responseBody) => {
  if (responseBody.success) {
    updateFavorites(responseBody);
  }
});

favoritesWidget.addUserCallback = ({ id, name }) => {
  ApiConnector.addUserToFavorites({ id, name }, (responseBody) => {
    if (responseBody.success) {
      updateFavorites(responseBody);
      favoritesWidget.setMessage(
        true,
        `Пользователь ${name} успешно добавлен в адресную книгу`
      );
    } else {
      favoritesWidget.setMessage(false, responseBody.error);
    }
  });
};

favoritesWidget.removeUserCallback = (id) => {
  ApiConnector.removeUserFromFavorites(id, (responseBody) => {
    if (responseBody.success) {
      updateFavorites(responseBody);
      favoritesWidget.setMessage(true, `Пользователь удален`);
    } else {
      favoritesWidget.setMessage(false, responseBody.error);
    }
  });
};
