﻿#include "awtk.h"
#include "navigator.h"
extern ret_t login_init(widget_t* win, void* ctx);
extern ret_t payment_init(widget_t* win, void* ctx);
extern ret_t getStarted_init(widget_t* win, void* ctx);
extern ret_t searchCard_init(widget_t* win, void* ctx);
extern ret_t result_init(widget_t* win, void* ctx);
extern ret_t moreApps_init(widget_t* win, void* ctx);
extern ret_t transferSuccess_init(widget_t* win, void* ctx);
extern ret_t transferLoading_init(widget_t* win, void* ctx);
extern ret_t transactionPage_init(widget_t* win, void* ctx);
extern ret_t emvProcess_init(widget_t* win, void* ctx);
extern ret_t emvProcessArchive_init(widget_t* win, void* ctx);
extern ret_t profile_init(widget_t* win, void* ctx);
extern ret_t error_init(widget_t* win, void* ctx);
extern ret_t balance_init(widget_t* win, void* ctx);
extern ret_t inputAmt_init(widget_t* win, void* ctx);
extern ret_t app_store_init(widget_t* win, void* ctx);
extern ret_t makeTransfer_init(widget_t* win, void* ctx);
extern ret_t error_dialog_init(widget_t* win, void* ctx);
extern ret_t authMenu_init(widget_t* win, void* ctx);
extern ret_t account_init(widget_t* win, void* ctx);
extern ret_t online_init(widget_t* win, void* ctx);
extern ret_t eSign_init(widget_t* win, void* ctx);
extern ret_t sample_ui_init(widget_t* win, void* ctx);

#ifndef WITH_MVVM

extern ret_t home_page_init(widget_t* win, void* ctx);

static ret_t navigator_window_init(const char* name, widget_t* win, void* ctx) {
    if (tk_str_eq(name, "login")) {
      return login_init(win, ctx);
    } else if (tk_str_eq(name, "payment")) {
      return payment_init(win, ctx);
    } else if (tk_str_eq(name, "getStarted")) {
      return getStarted_init(win, ctx);
    } else if (tk_str_eq(name, "searchCard")) {
      return searchCard_init(win, ctx);
    } else if (tk_str_eq(name, "result")) {
      return result_init(win, ctx);
    } else if (tk_str_eq(name, "moreApps")) {
      return moreApps_init(win, ctx);
    } else if (tk_str_eq(name, "transferSuccess")) {
      return transferSuccess_init(win, ctx);
    } else if (tk_str_eq(name, "transferLoading")) {
      return transferLoading_init(win, ctx);
    } else if (tk_str_eq(name, "transactionPage")) {
      return transactionPage_init(win, ctx);
    } else if (tk_str_eq(name, "emvProcess")) {
      return emvProcess_init(win, ctx);
    } else if (tk_str_eq(name, "emvProcessArchive")) {
      return emvProcessArchive_init(win, ctx);
    } else if (tk_str_eq(name, "profile")) {
      return profile_init(win, ctx);
    } else if (tk_str_eq(name, "error")) {
      return error_init(win, ctx);
    } else if (tk_str_eq(name, "balance")) {
      return balance_init(win, ctx);
    } else if (tk_str_eq(name, "inputAmt")) {
      return inputAmt_init(win, ctx);
    } else if (tk_str_eq(name, "app_store")) {
      return app_store_init(win, ctx);
    } else if (tk_str_eq(name, "makeTransfer")) {
      return makeTransfer_init(win, ctx);
    } else if (tk_str_eq(name, "error_dialog")) {
      return error_dialog_init(win, ctx);
    } else if (tk_str_eq(name, "authMenu")) {
      return authMenu_init(win, ctx);
    } else if (tk_str_eq(name, "account")) {
      return account_init(win, ctx);
    } else if (tk_str_eq(name, "online")) {
      return online_init(win, ctx);
    } else if (tk_str_eq(name, "eSign")) {
      return eSign_init(win, ctx);
    } else if (tk_str_eq(name, "sample_ui")) {
      return sample_ui_init(win, ctx);
    } else if (tk_str_eq(name, "home_page")) {
    return home_page_init(win, ctx);
  }

  return RET_OK;
}

static ret_t navigator_window_open_and_close(const char* name,
                                             widget_t* to_close, void* ctx) {
  ret_t ret = RET_OK;
  widget_t* wm = window_manager();
  widget_t* win = widget_child(wm, name);

  if (win != NULL) {
    bool_t single_instance = widget_get_prop_bool(win, WIDGET_PROP_SINGLE_INSTANCE, FALSE);
    if (single_instance) {
      window_manager_close_window_force(wm, win);
    }
  }

  win = window_open_and_close(name, to_close);
  return_value_if_fail(win != NULL, RET_FAIL);

  ret = navigator_window_init(name, win, ctx);
  return_value_if_fail(ret == RET_OK, ret);

  if (widget_is_dialog(win) &&
      widget_get_prop_bool(win, NAVIGATOR_PROP_DIALOG_TO_MODAL, TRUE)) {
    return (ret_t)dialog_modal(win);
  }

  return ret;
}

ret_t navigator_to(const char* target) {
  return navigator_to_with_context(target, NULL);
}

ret_t navigator_to_with_context(const char* target, void* ctx) {
  return_value_if_fail(target != NULL &&* target != '\0', RET_BAD_PARAMS);

  return navigator_window_open_and_close(target, NULL, ctx);
}

ret_t navigator_replace(const char* target) {
  widget_t* curr_win = NULL;
  widget_t* wm = window_manager();
  return_value_if_fail(target != NULL &&* target != '\0', RET_BAD_PARAMS);

  curr_win = window_manager_get_top_main_window(wm);
  if (curr_win != NULL) {
    log_debug("close current window: %s\n", curr_win->name);
  }

  return navigator_window_open_and_close(target, curr_win, NULL);
}

ret_t navigator_switch_to(const char* target, bool_t close_current) {
  widget_t* target_win;
  widget_t* wm = window_manager();
  return_value_if_fail(target != NULL &&* target != '\0', RET_BAD_PARAMS);

  target_win = widget_child(wm, target);
  if (target_win != NULL) {
    widget_t* curr_win = window_manager_get_top_window(wm);
    return window_manager_switch_to(wm, curr_win, target_win, close_current);
  } else {
    return navigator_to(target);
  }
}

ret_t navigator_back_to_home(void) {
  return window_manager_back_to_home(window_manager());
}

ret_t navigator_back(void) {
  return window_manager_back(window_manager());
}

ret_t navigator_close(const char* target) {
  widget_t* win;
  widget_t* wm = window_manager();
  return_value_if_fail(target != NULL &&* target != '\0', RET_BAD_PARAMS);

  win = widget_child(wm, target);
  return_value_if_fail(win != NULL, RET_FAIL);

  return window_manager_close_window_force(wm, win);
}

ret_t navigator_request_close(const char* target) {
  widget_t* win;
  widget_t* wm = window_manager();
  return_value_if_fail(target != NULL &&* target != '\0', RET_BAD_PARAMS);

  win = widget_child(wm, target);
  return_value_if_fail(win != NULL, RET_FAIL);

  return widget_dispatch_simple_event(win, EVT_REQUEST_CLOSE_WINDOW);
}

ret_t navigator_global_widget_on(uint32_t type, event_func_t on_event, void* ctx) {
  widget_t* wm = window_manager();
  widget_on(wm, type, on_event, ctx);

  return RET_OK;
}

#endif /*WITH_MVVM*/
