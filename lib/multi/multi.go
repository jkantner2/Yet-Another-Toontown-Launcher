package multi

/*
#include <X11/X.h>
#include <stdio.h>
#include <stdlib.h>
#include <xdo.h>

int xdo_select_window()
{
	xdo_t *xdo = xdo_new(NULL);
	if (!xdo) {
		fprintf(stderr, "Failde to init xdo\n");
		return 1;
	}

	printf("Click on window to select\n");

	Window w = 0;
	int ret = xdo_select_window_with_click(xdo, &w);

	if (ret != XDO_SUCCESS) {
		fprintf(stderr, "Failed to select window\n");
		xdo_free(xdo);
		return 1;
	}

	// get window name
	unsigned char *name = NULL;
	int name_len = 0;
	int name_type = 0;
	ret = xdo_get_window_name(xdo, w, &name, &name_len, &name_type);
	if (ret == XDO_SUCCESS && name != NULL) {
		printf("Window 0x%lx name: %.*s (length=%d, type=%d)\n",
		       w,
		       name_len,
		       name,
		       name_len,
		       name_type);
		free(name);
	} else {
		printf("Window 0x%lx has no name or failed to retrieve it\n",
		       w);
	}

	xdo_free(xdo);
        return 0;
}
#cgo LDFLAGS: -lxdo
*/
import "C"

func Go_select_window() {
	C.xdo_select_window()
}
