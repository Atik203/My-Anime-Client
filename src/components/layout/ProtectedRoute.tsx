import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import {
  useCurrentToken,
  useCurrentUser,
} from "../../redux/features/auth/authSlice";
import { useAppSelector } from "../../redux/hooks";

const ProtectedRoute = ({
  children,
  role = ["normal"],
}: {
  children: ReactNode;
  role: string[];
}) => {
  const token = useAppSelector(useCurrentToken);
  const user = useAppSelector(useCurrentUser);

  if (!token) {
    return <Navigate to={"/login"} replace={true} />;
  }

  if (user?.role && !role.includes(user.role as string)) {
    return <Navigate to={"/login"} replace={true} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
